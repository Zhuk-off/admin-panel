import $ from 'jquery';

$.get(
    './api',
    (data) => {
        data.forEach((file) => {
            $('body').append(`<h2>${file}</h2>`);
        });
    },
    'JSON'
);
