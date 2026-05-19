export interface Stat {
    label: string;
    sublabel: string;
    end: number;
    suffix: string;
}

export const stats: Stat[] = [
    {
        label: 'Transformations',
        sublabel: 'Shaped with precision',
        end: 10000,
        suffix: '+',
    },
    {
        label: 'Years Experience',
        sublabel: 'A legacy of style',
        end: 16,
        suffix: '+',
    },
    {
        label: 'Return Rate',
        sublabel: 'Trusted by many',
        end: 98,
        suffix: '%',
    },
    {
        label: 'Artisans',
        sublabel: 'Dedicated to you',
        end: 10,
        suffix: '+',
    },
];
