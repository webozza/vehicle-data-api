var currentUrl = window.location.href;
var searchForm = $(".search_car_field form");

$(searchForm).change(() => {
  var regNo = $(this).find('input[name="reg"]').val();
});

$(searchForm).submit(() => {
  window.location.href = currentUrl + regNo;
});
