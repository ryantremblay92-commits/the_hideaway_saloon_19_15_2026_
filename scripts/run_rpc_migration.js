const { Client } = require('pg');

const sql = `
-- Function to calculate and update customer tier
CREATE OR REPLACE FUNCTION public.calculate_customer_tier()
RETURNS TRIGGER AS $$
DECLARE
  v_new_tier TEXT;
BEGIN
  -- Determine new tier based on lifetime points
  IF NEW.lifetime_points >= 2500 THEN
    v_new_tier := 'platinum';
  ELSIF NEW.lifetime_points >= 1000 THEN
    v_new_tier := 'gold';
  ELSIF NEW.lifetime_points >= 500 THEN
    v_new_tier := 'silver';
  ELSE
    v_new_tier := 'bronze';
  END IF;

  -- Update tier if changed
  NEW.tier := v_new_tier;
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update tier
DROP TRIGGER IF EXISTS update_customer_tier ON public.customer_points;
CREATE TRIGGER update_customer_tier
  BEFORE INSERT OR UPDATE ON public.customer_points
  FOR EACH ROW
  EXECUTE PROCEDURE public.calculate_customer_tier();

-- Function to add points to customer
CREATE OR REPLACE FUNCTION public.add_loyalty_points(
  p_customer_id UUID,
  p_points INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_booking_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_customer_points_id UUID;
BEGIN
  -- Get or create customer points record
  INSERT INTO public.customer_points (customer_id, total_points, available_points, lifetime_points)
  VALUES (p_customer_id, 0, 0, 0)
  ON CONFLICT (customer_id) DO NOTHING
  RETURNING id INTO v_customer_points_id;
  
  IF v_customer_points_id IS NULL THEN
    SELECT id INTO v_customer_points_id FROM public.customer_points WHERE customer_id = p_customer_id;
  END IF;
  
  -- Update customer points
  UPDATE public.customer_points
  SET 
    total_points = total_points + p_points,
    available_points = available_points + p_points,
    lifetime_points = lifetime_points + p_points,
    updated_at = NOW()
  WHERE customer_id = p_customer_id;
  
  -- Log the transaction
  INSERT INTO public.points_transactions (customer_id, points, transaction_type, description, booking_id)
  VALUES (p_customer_id, p_points, p_transaction_type, p_description, p_booking_id)
  RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redeem points
CREATE OR REPLACE FUNCTION public.redeem_loyalty_points(
  p_customer_id UUID,
  p_points INTEGER,
  p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available_points INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Check available points
  SELECT available_points INTO v_available_points
  FROM public.customer_points
  WHERE customer_id = p_customer_id;
  
  IF v_available_points IS NULL OR v_available_points < p_points THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;
  
  -- Deduct points
  UPDATE public.customer_points
  SET 
    available_points = available_points - p_points,
    total_points = total_points - p_points,
    updated_at = NOW()
  WHERE customer_id = p_customer_id;
  
  -- Log the transaction
  INSERT INTO public.points_transactions (customer_id, points, transaction_type, description)
  VALUES (p_customer_id, -p_points, 'redeem', p_description);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code like ELGXXXXXX where X is uppercase alphanumeric
    v_code := 'ELG' || upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if it exists
    SELECT EXISTS(SELECT 1 FROM public.referrals WHERE referral_code = v_code) INTO v_exists;
    
    -- Exit loop if unique
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to complete referral (used when a new customer makes first booking via referral)
CREATE OR REPLACE FUNCTION public.complete_referral(
  p_referral_id UUID,
  p_referee_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_referral record;
BEGIN
  -- Get referral record
  SELECT * INTO v_referral
  FROM public.referrals
  WHERE id = p_referral_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Referral not found or already completed';
  END IF;
  
  -- Update referral status
  UPDATE public.referrals
  SET 
    status = 'completed',
    referee_id = p_referee_id,
    completed_at = NOW()
  WHERE id = p_referral_id;
  
  -- Reward referrer
  PERFORM public.add_loyalty_points(
    v_referral.referrer_id,
    v_referral.referrer_reward_points,
    'referral_earn',
    'Reward for referring a new customer'
  );
  
  -- Reward referee
  PERFORM public.add_loyalty_points(
    p_referee_id,
    v_referral.referee_reward_points,
    'referral_bonus',
    'Bonus for joining via referral'
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';
const client = new Client({ connectionString });

client.connect().then(() => {
    return client.query(sql);
}).then(() => {
    console.log('✅ Successfully applied RPC migration');
    return client.end();
}).catch(e => {
    console.error('Error:', e);
    client.end();
});
