// BEFORE REGISTRATION NO. GETS ENTERED
var currentUrl = window.location.href;
var searchForm = $(".search_car_field form");

$(searchForm).submit(() => {
  window.location.href = currentUrl + regNo;
});

// AFTER REGISTRATION NO. GETS ENTERED
const currentSearch = window.location.search;
const searchTerm = currentSearch.slice(5, currentSearch.length);

let fetchMotHistoryAndTaxStatusData = async () => {
  const url = `https://uk1.ukvehicledata.co.uk/api/datapackage/MotHistoryAndTaxStatusData?v=2&api_nullitems=1&auth_apikey=0f7d99d6-cef1-4ba3-a5d9-f0f9cc2cf109&key_VRM=${searchTerm}`;
  // const url = `/MotHistoryTax.json`;
  let res = await fetch(url);
  return await res.json();
};

let fetchVdiCheckFull = async () => {
  const url = `https://uk1.ukvehicledata.co.uk/api/datapackage/VdiCheckFull?v=2&api_nullitems=1&auth_apikey=0f7d99d6-cef1-4ba3-a5d9-f0f9cc2cf109&key_VRM=${searchTerm}`;
  // const url = `/VdiCheckFull.json`;
  let res = await fetch(url);
  return await res.json();
};

let onError = () => {
  $(".error-msg").append(
    `Registration No. "${searchTerm}" is Invalid. Try KM12AKK to test`
  );
  $(".notice").hide();
};

let reportDate = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  return currentDate;
};

let onSuccess = () => {
  $(".notice").hide();
  $("#root").fadeIn("slow");
  $(".report-id").append(`<div>Report ID: ${searchTerm}-GXX4YD</div>`);
  $(".report-date").append(`<div>Report Date: ${reportDate()}</div>`);
  $("body.home").addClass("on-success");
};

let renderData = async () => {
  let motHistoryTaxData = await fetchMotHistoryAndTaxStatusData();
  let vdiCheckFullData = await fetchVdiCheckFull();
  // console.log(motHistoryTaxData, vdiCheckFullData);

  // MOT HISTORY & TAX SORTING
  let mhtvd = motHistoryTaxData.Response.DataItems.VehicleDetails;
  let mhtvs = motHistoryTaxData.Response.DataItems.VehicleStatus;
  let mhtai =
    motHistoryTaxData.Response.DataItems.MotHistory.AdditionalInformation;
  let mhtrl = motHistoryTaxData.Response.DataItems.MotHistory.RecordList;

  // VDI CHECK FULL SORTING
  let vdiCheckFull = vdiCheckFullData.Response.DataItems;
  console.log(vdiCheckFull);

  // IF NO PREVIOUS KEEPERS
  if (mhtai.KeeperChange === null) {
    mhtai.KeeperChange = "None";
  }
  if (mhtai.MileageAnomalyDetected === false) {
    mhtai.MileageAnomalyDetected = "All Clear";
  }

  if (vdiCheckFullData.Response.StatusCode === "KeyInvalid") {
    onError();
  } else {
    let vehicleOverview = `
      <div id="vehicle_overview">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">At a Glance</h4>
        <div>Reg No.: ${searchTerm}</div>
        <div>Make: ${vdiCheckFull.Make}</div>
        <div>Model: ${vdiCheckFull.Model}</div>
        <div>Outstanding Finance: ${vdiCheckFull.FinanceRecordCount}</div>
        <div>Insurance Written-off: ${vdiCheckFull.WrittenOff}</div>
        <div>Police Stolen: ${vdiCheckFull.StolenPoliceForce}</div>
        <div>Mileage Anomaly: ${vdiCheckFull.MileageAnomalyDetected}</div>
        <div>High Risk Vehicle: ${vdiCheckFull.HighRiskRecordCount}</div>
        <div>Exported: ${vdiCheckFull.Exported}</div>
        <div>Imported: ${vdiCheckFull.Imported}</div>
        <div>Scrapped: ${vdiCheckFull.Scrapped}</div>
        <div>Colour Change: ${vdiCheckFull.ColourChangeCount}</div>
        <div>Previous N.Ireland: ??</div>
        <div>MOT Status: ${mhtvs.DaysUntilNextMotIsDue} days left</div>
        <div>MOT Due: ${mhtvs.NextMotDueDate}</div>
        <div style="color: #fff;text-align:center; margin-top: 20px; font-size: .85em; opacity: .9">
        As of report date: ${reportDate()}</div>
      </div>
    `;
    let vehicleDlva = `
      <div id="vehicle_dlva">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">DVLA Vehicle Details</h4>
        <div>Make: ${mhtvd.Make}</div>
        <div>Model: ${mhtvd.Model}</div>
        <div>Year Built: ??</div>
        <div>Fuel: ${mhtvd.FuelType}</div>
        <div>Gearbox: ??</div>
        <div>Colour: ${mhtvd.Colour}</div>
        <div>Rgistered in UK: ${mhtvd.DateFirstRegistered}</div>
        <div>Engine CC: ??</div>
        <div>Body Style: ??</div>
        <div>No of Seats: ??</div>
        <div>Previous Keepers: ${mhtai.KeeperChange}</div>
        <div>Last Keeper Change: ??</div>
        <div>Colour Changed: ??</div>
        <div>Imported: ??</div>
      </div>
    `;
    let technicalData = `
      <div id="technical_data">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Technical Data</h4>
        <div class="td-dimensions">
          <div>Length mm: ??</div>
          <div>Width mm: ??</div>
          <div>Height mm: ??</div>
          <div>Weight Kgs: ??</div>
        </div>
        <div class="td-engine-data">
          <div>Engine CC: ??</div>
          <div>Cylinder Type: ??</div>
          <div>Aspiration: ??</div>
          <div>Engine Location: ??</div>
          <div>Bore mm: ??</div>
          <div>Stroke mm: ??</div>
          <div>No. of Cylinders: ??</div>
          <div>Valves: ??</div>
          <div>Power BHP: ??</div>
          <div>Torque lb/ft: ??</div>
          <div>0-62 mph: ?? Seconds</div>
          <div>Top Speed MPH: ??</div>
        </div>
      </div>
    `;
    let vehicleIdentification = `
      <div id="vehicle_identification">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Vehicle Identification</h4>
        <div>Engine Number: ??</div>
        <div>Full VIN: ??</div>
      </div>
    `;
    let v5cLogbookCheck = `
      <div id="v5c_logbook_check">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">V5C Logbook Check</h4>
        <form>
          <input placeholder="AA" />
          <input placeholder="123456" />
        </form>
      </div>
    `;
    let c02Banding = `
      <div id="c02_banding">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">c02 Banding</h4>
        <div>?? D 121 - 130</div>
        <div class="data--info">
          <div>D</div>
          <div>
            <div>127 g/km</div>
            <div>This is the amount of Carbon Dioxide (CO2) this
            vehicle emits derived from standard EU tests.</div>
          </div>
        </div>
      </div>
    `;
    let runingCosts = `
      <div id="running_costs">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Running Costs</h4>
        <div>6 Months Tax: ??</div>
        <div>12 Months Tax: ??</div>
      </div>
    `;
    let taxExpiryDate = `
      <div id="tax_expiry_date">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Tax Expiry Date</h4>
      </div>
    `;
    let yourNotes = `
      <div id="your_notes">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Your Notes</h4>
        <form>
          <input placeholder="Notes about this vehicle" />
          <input placeholder="URL to vehicle advert" />
        </form>
      </div>
    `;
    let factoryEquipment = `
      <div id="factory_equipment">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Factory Equipment</h4>
        <div class="fe-type">
          <div class="fe-standard-equipment">
            <h5>Standard Equipment</h5>
            <nav>
              <ul>
                <li>Comfort (get count)</li>
                <li>Safety & Security (24)</li>
                <li>Exterior (7)</li>
                <li>Interior (3)</li>
                <li>Other (1)</li>
              </ul>
            </nav>
          </div>
          <div class="fe-optional-equipment">
            <h5>Optional Equipment</h5>
            <nav>
              <ul>
                <li>Comfort (get count)</li>
                <li>Safety & Security (24)</li>
                <li>Exterior (7)</li>
                <li>Interior (3)</li>
                <li>Other (1)</li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    `;
    let vdiValuations = `
      <div id="vdi_valuations">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">VDI Valuations</h4>
        <div class="vdiv-header">
          <div>Valuation with: ${mhtrl[0].OdometerReading} miles</div>
          <div>On the Road (OTR): £??</div>
        </div>
        <div class="vdiv-body">
          <div>Dealer Forecourt ??</div>
          <div>Trade Retail ??</div>
          <div>Trade Average ??</div>
          <div>Trade Poor ??</div>
          <div>Private Clean ??</div>
          <div>Private Average ??</div>
          <div>Part Exchange ??</div>
          <div>Auction ??</div>
        </div>
      </div>
    `;
    let insuranceWriteOff = `
      <div id="insurance_writeoff" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Insurance Write Off</h4>
        <div>All Clear or Not ??</div>
        <div>If All Clear show - There are no insurance write-off details for this vehicle.</div>
      </div>
    `;
    let financialRecords = `
      <div id="financial_records" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Finance Records</h4>
        <div>All clear (Based on data held at Experian Finance)</div>
        <div>There are no outstanding nance records for this vehicle.</div>
      </div>
    `;
    let stolenVehicle = `
      <div id="insurance_writeoff" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">stolenVehicle</h4>
        <div>All Clear</div>
        <div>Vehicle is not reported Stolen.</div>
      </div>
    `;
    let vehicleScrapped = `
      <div id="vehicle_scrapped" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Vehicle Scrapped</h4>
        <div>All Clear</div>
        <div>Vehicle is not recorded as scrapped.</div>
      </div>
    `;
    let highRiskVehicle = `
      <div id="high_risk_vehicle" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">High Risk Vehicle</h4>
        <div>All Clear</div>
        <div>Vehicle has no High Risk records.</div>
      </div>
    `;
    let importedOutsideEu = `
      <div id="imported_outside_eu" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Imported outside EU</h4>
        <div>All Clear</div>
        <div>Vehicle not imported from outside EU</div>
      </div>
    `;
    let importedNorthernIsland = `
      <div id="imported_northern_island" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Imported Northern Ireland</h4>
        <div>All Clear</div>
        <div>Vehicle not a previous Northern Ireland Vehicle.</div>
      </div>
    `;
    let vehicleExported = `
      <div id="vehicle_exported" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Vehicle Exported</h4>
        <div>AllClear</div>
        <div>Vehicle not exported.</div>
      </div>
    `;
    let colourChange = `
      <div id="colour_change" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Colour Change</h4>
        <div>All Clear</div>
        <div>Vehicle colour has not been changed.</div>
      </div>
    `;
    let plateTransfers = `
      <div id="plate_transfers">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Plate Transfers (3)</h4>
        <div>Latest plate transfer information.</div>
        <div class="vehicle-data-list">
          <table>
            <tr>
              <th>#</th>
              <th>Transferred on</th>
              <th>Previous Reg.</th>
              <th>Transfer Date</th>
            </tr>
            <tr>
              <td class="pt-id">1</td>
              <td class="pt-transfered-on">??</td>
              <td class="pt-previous-reg">??</td>
              <td class="pt-transfer-date">??</td>
            </tr>
          </table>
        </div>
      </div>
    `;
    let keeperChanges = `
      <div id="keeper_changes">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Keeper Changes (3)</h4>
        <div>Latest plate transfer information.</div>
        <div class="keeper-changes-list">
          <table>
            <tr>
              <th>Keeper Changed</th>
              <th>Previous Keepers</th>
            </tr>
            <tr>
              <td class="pt-id">02/02/2022</td>
              <td class="pt-prev-keepers">3</td>
            </tr>
          </table>
        </div>
        <div>Date of Original Purchase: ??</div>
        <div>Total number of owners including the current keeper: 4</div>
      </div>
    `;
    let recallInformation = `
    <div id="recall_information" class="has-description">
      <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Recall Information</h4>
      <div>All Clear</div>
      <div>No recalls for this vehicle located.</div>
    </div>
    `;
    let vehicleMileageAnomaly = `
      <div id="mileage_anomaly" class="has-description">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Mileage Anomaly</h4>
        <div>All Clear</div>
        <div>No mileage discrepancies found.</div>
      </div>
    `;
    let mileageRecords = `
      <div id="mileage_records">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">Mileage Records (3)</h4>
        <div>Latest plate transfer information.</div>
        <div class="keeper-changes-list">
          <table>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Mileage</th>
              <th>Source</th>
            </tr>
            <tr>
              <td>1</td>
              <td>07/10/2022</td>
              <td>71,571</td>
              <td>MOT Test</td>
            </tr>
          </table>
        </div>
        <div>Date of Original Purchase: ??</div>
        <div>Total number of owners including the current keeper: 4</div>
      </div>
    `;
    let vehicleMotHistory = `
      <div id="mileage_records">
        <h4 style="color: #fff; margin: 0; padding-bottom: 20px;">MOT History (5) <span>As of: 25/10/2022</span></h4>
        <div>MOT Status: PASSED</div>
        <div>Next MOT Due: 06/10/2023</div>
        <div>Days Remaining: 346 Days</div>
        <div class="keeper-changes-list">
          <table>
            <tr>
              <td>1</td>
              <td>07/10/2022</td>
              <td>PASSED</td>
              <td>All Clear</td>
            </tr>
          </table>
        </div>
      </div>
    `;
    $("#generated_html").append(
      vehicleOverview,
      vehicleDlva,
      technicalData,
      vehicleIdentification,
      v5cLogbookCheck,
      c02Banding,
      runingCosts,
      taxExpiryDate,
      yourNotes,
      factoryEquipment,
      vdiValuations,
      insuranceWriteOff,
      financialRecords,
      stolenVehicle,
      vehicleScrapped,
      highRiskVehicle,
      importedNorthernIsland,
      importedOutsideEu,
      vehicleExported,
      colourChange,
      plateTransfers,
      keeperChanges,
      recallInformation,
      vehicleMileageAnomaly,
      mileageRecords,
      vehicleMotHistory
    );
    onSuccess();
  }
};

if (window.location.href.indexOf("?reg") > -1) {
  renderData();
}
