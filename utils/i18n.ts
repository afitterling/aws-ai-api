// TODO move to external module

import _ from "lodash";

const locale = "en";
const t = {};

//const DEFAULT = "en";
//const locales = ['en', 'de'];

t['en'] = {
    "greet": "Hello it works!",

    "NO_EXPENSES": "no expenses",

    "DAY": "Day",

    "SUM": "Sum",

    "SUM_MONTH": "Total",

    "CATEGORIES": {
        "NONE": "None",
        "PERSONAL": "Personal",
        "LAUNDRY": "Laundry",
        "EAT_OUTSIDE": "DineOut",
        "SNACKS_OUTSIDE": "Snacks",
        "COFFE_CAKE": "Coffee & Cake",
        "SANITARY": "Sanitary",
        "LIVING": "Living",
        "GROCERIES": "Groceries",
        "FOOD": "Food",
        "COMMUNICATION": "Communication",
        "TRAVEL": "Public Transportation",
        "HEALTH": "Healthcare & Medicine",
        "CLOTHING": "Clothing",
        "JOURNEY": "Travel & Journey",
        "OFFICE_UTILITIES": "Office",
        "COMPANY": "Company",
        "DONATION": "Donation",
        "PRESENTS": "Gift",
        "LEISURE": "Leisure",
        "FINANCIAL": "Financial Utils",
        "EMPLOYER": "Employer Costs",
        "BUSINESS": "Business",
        "DIGITAL_SUBSCRIPTION": "Digital Subscription",
        "EDUCATION": "Education",
        "LITERATURE": "Literature",
        "CHILD": "Child",
        "GADGETS": "Gadgets",
        "HOUSING": "Housing Expenses",
        "LOANS": "Loans",
        "INSURANCE": "Insurance",
        "SAVINGS": "Savings Plan",
        "INVESTMENTS": "Investment Plan",
        "MISC1": "Norbert",
    },
    "INSTALLMENT_TYPES": {
        "YEARLY": "Yr",
        "MONTHLY": "Mth",
        "QUTRLY": "Qtr"
    }
};

t['de'] = {
    "greet": "Hallo, es geht!",

    "NO_EXPENSES": "no expenses",

    "DAY": "Tag",

    "SUM": "Sum",

    "SUM_MONTH": "Total"
};


Object.keys(t['en']).forEach((key) => {
    if (t['de'] != undefined) {
        t['de'] = key.toUpperCase();
    }
});

//const tf = (key, loc) => { return t[loc] != undefined ? t[loc][key] : t[DEFAULT][key] != undefined ? t[DEFAULT][key] : key.toUpperCase() }



export const translate = (locale, path) => {
    //console.log(locale, path);
    return _.get(t[locale], path) == undefined ? path : _.get(t[locale], path);
}

export default { locale, t };
