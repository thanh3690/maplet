$(document).ready(function () {
    var AjaxUrl, Z, baseMaps, cities, deleteShape, drawnItems, latlng, map, nexrad, onKeyDown, onZoomend, osm,
        overlayMaps, redoBuffer, save_data, show_saved_info;
    return show_saved_info = function () {
        return $("#infor").css("color", "#ff0"), $("#infor").text("用户数据已经成功保存！"), setTimeout("$('#infor').text('');", 8e3)
    }, save_data = function () {
        var shape;
        return shape = drawnItems.toGeoJSON(), map.doubleClickZoom.enable(), $.ajax({
            type: "POST",
            url: "/geojson/" + map_uid + "/" + geojsonid,
            data: {geojson: JSON.stringify(shape)},
            dataType: "html",
            timeout: 2e3,
            error: function () {
                return alert("请登陆后进行数据保存！或再次尝试进行保存！")
            },
            success: function (result) {
                var geo;
                return geo = $.parseJSON(result), 0 === geo.status ? alert("请检查是否拥有数据权限！") : (show_saved_info(), "" !== geo.sig ? location.href = "/map/" + map_uid + "?gson=" + geo.sig + "&fullscreen=1" : void 0)
            }
        })
    }, $("#load_geojson").click(function () {
        var gdata, gson_arr, hdata;
        return hdata = $("#hdata").val(), gson_arr = new Array, gdata = $.parseJSON(hdata).features, $.each(gdata, function (i, item) {
            var myGeoJson;
            if (gson_arr[i] = item, 1 === login) return myGeoJson = L.geoJson(item, {
                onEachFeature: function (feature, layer) {
                    var input = L.DomUtil.create("input", "my-input");
                    input.value = feature.properties.name, L.DomEvent.addListener(input, "change", function () {
                        feature.properties.name = input.value
                    }), layer.bindPopup(input)
                }
            }), myGeoJson.addTo(drawnItems)
        }), 0 === login && L.geoJson(gson_arr).addTo(drawnItems), $("#hdata").val(""), $("#infor").css("color", "#ff0"), $("#infor").text("已经加载GeoJson数据！"), setTimeout("$('#infor').text('');", 8e3)
    }), cities = new L.LayerGroup, drawnItems = new L.FeatureGroup, nexrad = L.tileLayer.wms("http://wcs.osgeo.cn:8088/service?", {
        layers: "maplet_" + map_uid,
        format: "image/png",
        transparent: !0,
        attribution: "Maplet"
    }), osm = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnVrdW4iLCJhIjoiY2lqeWFjZmo4MXFubndka2lzcnZ1M2tzciJ9.C1dZUQkRZSIEKfg-DaFYpw", {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: "mapbox.streets"
    }), nexrad.addTo(cities), osm.addTo(cities), map = L.map("map", {
        center: [vlat, vlon],
        zoom: vzoom_current,
        maxZoom: vzoom_max,
        minZoom: vzoom_min,
        layers: [cities],
        editable: !0,
        editOptions: {featuresLayer: drawnItems}
    }), map.addLayer(drawnItems), AjaxUrl = "/geojson/gson/" + geojsonid, "" !== geojsonid && $.getJSON(AjaxUrl, function (gjson) {
        var gson_arr;
        if (gson_arr = new Array, $.each(gjson, function (i, item) {
                var myGeoJson;
                if (gson_arr[i] = item, 1 === login) return myGeoJson = L.geoJson(item, {
                    onEachFeature: function (feature, layer) {
                        var input = L.DomUtil.create("input", "my-input");
                        input.value = feature.properties.name, L.DomEvent.addListener(input, "change", function () {
                            feature.properties.name = input.value
                        }), layer.bindPopup(input)
                    }
                }), myGeoJson.addTo(drawnItems)
            }), 0 === login) return L.geoJson(gson_arr).addTo(drawnItems)
    }), L.EditControl = L.Control.extend({
        options: {position: "topleft", callback: null, kind: "", html: ""},
        onAdd: function (map) {
            var container, link;
            return container = L.DomUtil.create("div", "leaflet-control leaflet-bar"), link = L.DomUtil.create("a", "", container), link.href = "#", link.title = this.options.kind, link.innerHTML = this.options.html, L.DomEvent.on(link, "click", L.DomEvent.stop).on(link, "click", function () {
                return window.LAYER = this.options.callback.call(map.editTools), map.doubleClickZoom.disable(), map.dragging.disable()
            }, this), container
        }
    }), L.EditSaveControl = L.EditControl.extend({
        options: {
            position: "topleft",
            callback: save_data,
            kind: "保存编辑",
            html: '<span class="glyphicon glyphicon-save"></span>'
        }
    }), L.NewLineControl = L.EditControl.extend({
        options: {
            position: "topleft",
            callback: map.editTools.startPolyline,
            kind: "线",
            html: "\\/\\"
        }
    }), L.NewPolygonControl = L.EditControl.extend({
        options: {
            position: "topleft",
            callback: map.editTools.startPolygon,
            kind: "多边形",
            html: "▰"
        }
    }), L.NewMarkerControl = L.EditControl.extend({
        options: {
            position: "topleft",
            callback: map.editTools.startMarker,
            kind: "点标注",
            html: '<span class="glyphicon glyphicon-map-marker"></span>'
        }
    }), L.NewRectangleControl = L.EditControl.extend({
        options: {
            position: "topleft",
            callback: map.editTools.startRectangle,
            kind: "矩形",
            html: "⬛"
        }
    }), L.NewCircleControl = L.EditControl.extend({
        options: {
            position: "topleft",
            callback: map.editTools.startCircle,
            kind: "circle",
            html: "⬤"
        }
    }), map.addControl(new L.EditSaveControl), map.addControl(new L.NewMarkerControl), map.addControl(new L.NewLineControl), map.addControl(new L.NewPolygonControl), map.addControl(new L.NewRectangleControl), "1" === vmarker.toString() && L.marker([vlat, vlon]).addTo(map), 1 === login && (Z = 90, latlng = void 0, redoBuffer = [], onKeyDown = function (e) {
        if (e.keyCode === Z) {
            if (!this.editTools._drawingEditor) return;
            if (e.shiftKey) {
                if (redoBuffer.length) return this.editTools._drawingEditor.push(redoBuffer.pop())
            } else if (latlng = this.editTools._drawingEditor.pop()) return redoBuffer.push(latlng)
        } else if (69 === e.keyCode) return map.dragging.enabled() ? map.dragging.disable() : map.dragging.enable()
    }, L.DomEvent.addListener(document, "keydown", onKeyDown, map), map.on("editable:drawing:end", function () {
        return redoBuffer = []
    })), deleteShape = function (e) {
        if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) return this.editor.deleteShapeAt(e.latlng)
    }, map.on("layeradd", function (e) {
        if (e.layer instanceof L.Path && e.layer.on("click", L.DomEvent.stop).on("click", deleteShape, e.layer), e.layer instanceof L.Path || e.layer instanceof L.Marker) return e.layer.on("dblclick", L.DomEvent.stop).on("dblclick", e.layer.toggleEdit)
    }), map.on("editable:vertex:ctrlclick editable:vertex:metakeyclick", function (e) {
        var index;
        return index = e.vertex.getIndex(), 0 === index ? e.layer.editor.continueBackward(e.vertex.latlngs) : index === e.vertex.getLastIndex() ? e.layer.editor.continueForward(e.vertex.latlngs) : void 0
    }), map.on("zoomend", onZoomend), map.on("moveend", onZoomend), map.on("editable:editing", function (e) {
        if (map.dragging.disable(), map.doubleClickZoom.disable(), e.layer instanceof L.Path) return e.layer.setStyle({color: "Red"})
    }), map.on("editable:disable", function (e) {
        return map.doubleClickZoom.enable(), map.dragging.enable()
    }), baseMaps = {osm: osm}, overlayMaps = {"专题地图": nexrad}, L.control.layers(baseMaps, overlayMaps).addTo(map)
});