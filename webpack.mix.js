const mix = require('laravel-mix');

// JS compilation
mix.js('resources/js/app.js', 'public/laralite/js')
   .js('resources/js/custom.js', 'public/laralite/js') // You can add your custom JS here
   .extract([
       'jquery', 'bootstrap', 'admin-lte', 'select2', 
       'bootstrap-datepicker', 'datatables.net-bs4', 
       'toastr', 'bootstrap-datetime-picker', 'sweetalert2'
   ]);

// CSS compilation
mix.sass('resources/sass/app.scss', 'public/laralite/css')
   .sass('resources/sass/custom.scss', 'public/laralite/css');

// Enable versioning for cache busting in production
if (mix.inProduction()) {
    mix.version();
}
