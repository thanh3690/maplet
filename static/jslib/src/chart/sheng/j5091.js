var bubu ={ s64:"2322",s65:"1884",s11:"6602",s12:"4380",s13:"2426",s14:"2146",s15:"2426",s21:"3175",s22:"2504",s23:"2419",s31:"9245",s32:"4150",s33:"5439",s34:"2167",s35:"3730",s36:"2576",s37:"3109",s41:"2372",s42:"2503",s43:"2863",s44:"3915",s45:"2329",s46:"2355",s50:"2236",s51:"2432",s52:"1621",s53:"1955",s54:"1534",s61:"1987",s62:"1812",s63:"1941" };
var title = "2005年各地区农村居民消费水平";
var unit = "元";
function getColor(d) {
    return d > 4400 ? '#800026' :
           d > 3200  ? '#BD0026' :
           d > 2600  ? '#E31A1C' :
           d > 2500  ? '#FC4E2A' :
           d > 2400   ? '#FD8D3C' :
           d > 2200  ? '#FEB24C' :
           d > 1900   ? '#FED976' :
           d > 1500   ? '#FFEDA0' :
           d < 0   ? '#000000' :
                      '#000000';
}
var vgrades = [1500, 1900, 2200, 2400, 2500, 2600, 3200, 4400];