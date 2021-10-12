/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.16106960832228, "KoPercent": 8.83893039167772};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.19468686727640858, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0655226209048362, 500, 1500, "tickets/1933/list"], "isController": false}, {"data": [0.17440119760479042, 500, 1500, "news/list?type=Article"], "isController": false}, {"data": [0.03491941673062164, 500, 1500, "games?type=history"], "isController": false}, {"data": [0.07817220543806647, 500, 1500, "tickets/stadium-ticket?id=2720&gameId=1931"], "isController": false}, {"data": [0.03571428571428571, 500, 1500, "games?type=upcoming"], "isController": false}, {"data": [0.0, 500, 1500, "stream?type=video"], "isController": false}, {"data": [0.0598256735340729, 500, 1500, "stream?type=audio"], "isController": false}, {"data": [0.29299610894941636, 500, 1500, "games/1933"], "isController": false}, {"data": [0.06525157232704402, 500, 1500, "games/1933/events"], "isController": false}, {"data": [0.9030188679245283, 500, 1500, "/tickets/list"], "isController": false}, {"data": [0.40236686390532544, 500, 1500, "news/list?type=Video"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14323, 1266, 8.83893039167772, 2375.1561125462476, 67, 8086, 2112.0, 5557.6, 6052.0, 6766.52, 37.867691770789826, 236.28076053883402, 40.350103328625096], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["tickets/1933/list", 1282, 0, 0.0, 2500.2355694227754, 78, 4108, 2629.5, 3284.7, 3479.3999999999996, 3777.0200000000004, 3.4340788123766126, 5.1769372192399485, 3.491089886410209], "isController": false}, {"data": ["news/list?type=Article", 1336, 0, 0.0, 1998.5456586826342, 628, 6870, 1705.5, 3497.499999999998, 4781.0499999999965, 5876.099999999991, 3.5435127988181216, 33.16055303234251, 4.335958532147565], "isController": false}, {"data": ["games?type=history", 1303, 0, 0.0, 5343.9232540291605, 203, 8086, 5750.0, 6627.6, 6961.6, 7360.84, 3.4867820721065463, 38.52704311163188, 3.609364254329042], "isController": false}, {"data": ["tickets/stadium-ticket?id=2720&gameId=1931", 1324, 0, 0.0, 2416.633685800605, 110, 4502, 2527.0, 3273.0, 3467.75, 3975.75, 3.543726479987581, 5.643537901680326, 3.689074636393322], "isController": false}, {"data": ["games?type=upcoming", 1316, 0, 0.0, 5080.867781155009, 182, 7914, 5460.5, 6365.3, 6644.15, 7148.769999999999, 3.5206463435840503, 34.25599781464439, 3.647857197795583], "isController": false}, {"data": ["stream?type=video", 1266, 1266, 100.0, 416.1690363349127, 173, 1535, 394.0, 547.3, 605.5999999999995, 752.9599999999991, 3.391983024009131, 4.629569740952703, 3.4549202090249254], "isController": false}, {"data": ["stream?type=audio", 1262, 0, 0.0, 2731.6275752773404, 182, 4251, 2891.5, 3554.2000000000003, 3713.85, 3959.2499999999973, 3.3870192888333035, 5.344112403683317, 3.4498643732940777], "isController": false}, {"data": ["games/1933", 1285, 0, 0.0, 1417.596108949417, 83, 2495, 1467.0, 1952.8000000000002, 2081.2000000000003, 2341.1400000000003, 3.441082508321528, 48.6376238019811, 3.474686829691856], "isController": false}, {"data": ["games/1933/events", 1272, 0, 0.0, 2466.8561320754716, 70, 4158, 2600.0, 3278.4, 3436.149999999999, 3828.08, 3.4079948558568214, 25.73234338160433, 3.524479055031615], "isController": false}, {"data": ["/tickets/list", 1325, 0, 0.0, 520.2762264150944, 67, 5949, 149.0, 464.80000000000064, 4573.1, 5560.32, 3.5453402188745886, 5.407365026222139, 3.7288392731718085], "isController": false}, {"data": ["news/list?type=Video", 1352, 0, 0.0, 1236.5554733727815, 419, 5899, 906.0, 2414.8, 3077.7999999999956, 4762.41, 3.5825862987272807, 32.10961493490664, 4.376772909870927], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["422/Unprocessable Entity", 1266, 100.0, 8.83893039167772], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14323, 1266, "422/Unprocessable Entity", 1266, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["stream?type=video", 1266, 1266, "422/Unprocessable Entity", 1266, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
