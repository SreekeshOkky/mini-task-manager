'use strict';

export const API_URL = 'https://devza.com/tests';

export const PRIORITY = [
    {
        value: '1',
        text: 'Normal'
    }, {
        value: '2',
        text: 'Mid'
    }, {
        value: '3',
        text: 'High'
    }
];

export const SUCCESS_STATUS = 'success';

export const DATE_FORMAT = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};

export const TASK_COLUMNS = [
    {
        label: 'Message',
        key: 'message'
    },
    {
        label: 'Date',
        key: 'due_date'
    },
    {
        label: 'Priority',
        key: 'priority_level'
    },
    {
        label: 'Assignee',
        key: 'assignee'
    }];
