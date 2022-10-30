const currentSearch = window.location.search;
const searchTerm = currentSearch.slice(5, currentSearch.length);

let fetchData = async () => {
  const url = `https://uk1.ukvehicledata.co.uk/api/datapackage/MotHistoryAndTaxStatusData?v=2&api_nullitems=1&auth_apikey=0f7d99d6-cef1-4ba3-a5d9-f0f9cc2cf109&key_VRM=${searchTerm}`;
  let res = await fetch(url);
  return await res.json();
};

let renderData = async () => {
  let data = await fetchData();
  console.log(data);
  if (data.Response.StatusCode === "KeyInvalid") {
    $(".error-msg").append(`Registration No. "${searchTerm}" is Invalid`);
  } else {
    let vd = data.Response.DataItems.VehicleDetails;
    console.log(vd.Colour);
    let html = `
    <div class="color">Color: ${vd.Colour}</div>
    <div class="color">Fuel Type: ${vd.FuelType}</div>
    <div class="color">Make: ${vd.Make}</div>
    <div class="color">Model: ${vd.Model}</div>
    <div class="color">Date First Registered: ${vd.DateFirstRegistered}</div>
  `;
    $("#generated_html").append(html);
  }
};

renderData();
