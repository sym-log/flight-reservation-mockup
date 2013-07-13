goog.provide('mock1');
goog.require('cljs.core');
goog.require('goog.fx.dom');
goog.require('goog.i18n.DateTimeSymbols_en_US');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.net.XhrIo');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.DatePicker');
goog.require('goog.date');
goog.require('goog.ui.InputDatePicker');
goog.require('goog.fx');
goog.inherits(mock1.pouchDB = (function pouchDB(dbName){
var this$ = this;
goog.events.EventTarget.call(this$);
Pouch.enableAllDbs = true;
this$.DB = (new Pouch(dbName));
this$.getAttachment = (function (docId){
return this$.DB.getAttachment(docId,(function (err,resp){
this$.response = resp;
return this$.dispatchEvent("docReady");
}));
});
this$.getResponse = (function (){
return this$.response;
});
return this$;
}),goog.events.EventTarget);
mock1.resizeDomNode = (function resizeDomNode(toWidth,toHeight,node){
var w = node.offsetWidth;
var h = node.offsetHeight;
return (new goog.fx.dom.Resize(node,[w,h],[toWidth,toHeight],250,goog.fx.easing.easeOut())).play();
});
mock1.createComboBox = (function createComboBox(title){
var cb = (new goog.ui.ComboBox());
var G__9496_9497 = cb;
G__9496_9497.setUseDropdownArrow(true);
G__9496_9497.addItem((new goog.ui.ComboBoxItem("San Francisco")));
G__9496_9497.addItem((new goog.ui.ComboBoxItem("New York")));
G__9496_9497.addItem((new goog.ui.ComboBoxItem("Houston")));
G__9496_9497.addItem((new goog.ui.ComboBoxItem("Miami")));
G__9496_9497.addItem((new goog.ui.ComboBoxItem("Boston")));
G__9496_9497.addItem((new goog.ui.ComboBoxItem("Los Angeles")));
G__9496_9497.addItem((new goog.ui.ComboBoxItem("Honolulu")));
G__9496_9497.addItem((new goog.ui.ComboBoxItem("Dallas")));
return cb;
});
mock1.fadeoutNode = (function fadeoutNode(node){
return (new goog.fx.dom.FadeOutAndHide(node,1500)).play();
});
mock1.fadeinNode = (function fadeinNode(node){
return (new goog.fx.dom.FadeInAndShow(node,1500)).play();
});
mock1.cb1_change_event_handler = (function cb1_change_event_handler(evt){
var node = goog.dom.getElement("departureWeatherDiv");
node.style.border = "1px solid gray";
mock1.resizeDomNode.call(null,240,30,node);
mock1.fadeinNode.call(null,goog.dom.getElement("floatingCirclesGone"));
mock1.fadeinNode.call(null,goog.dom.getElement("text1"));
return mock1.fadeoutNode.call(null,goog.dom.getElement("floatingCirclesGone"));
});
mock1.cb2_change_event_handler = (function cb2_change_event_handler(evt){
var node = goog.dom.getElement("arrivalWeatherDiv");
node.style.border = "1px solid gray";
mock1.resizeDomNode.call(null,240,30,node);
mock1.fadeinNode.call(null,goog.dom.getElement("floatingCirclesGtwo"));
mock1.fadeinNode.call(null,goog.dom.getElement("text2"));
return mock1.fadeoutNode.call(null,goog.dom.getElement("floatingCirclesGtwo"));
});
mock1.load_flight_confirmation = (function load_flight_confirmation(){
mock1.fadeinNode.call(null,goog.dom.getElement("circleLoadDiv"));
mock1.fadeinNode.call(null,goog.dom.getElement("contentDiv"));
return mock1.fadeoutNode.call(null,goog.dom.getElement("circleLoadDiv"));
});
mock1.appInit = (function appInit(){
var pattern = "MM/dd/yyyy";
var formatter = (new goog.i18n.DateTimeFormat(pattern));
var parser = (new goog.i18n.DateTimeParse(pattern));
var cb1 = mock1.createComboBox.call(null,"Departing City...");
var cb2 = mock1.createComboBox.call(null,"Arrival City...");
Pouch.allDbs.call(null,(function (err,response){
if(!(cljs.core._EQ_.call(null,-1,response.indexOf("testdb"))))
{var db = (new mock1.pouchDB("testdb"));
goog.events.listenOnce(db,"docReady",(function (evt){
var nNode = goog.dom.createElement("img");
var blob = evt.target.response;
nNode.src = goog.global.URL.createObjectURL(blob);
return goog.dom.getElement("logoDiv").appendChild(nNode);
}));
return db.getAttachment("otherdoc2/ablob");
} else
{var xhr = (new goog.net.XhrIo());
var xhb = (new goog.net.XhrIo());
goog.events.listenOnce(xhr,goog.net.EventType.COMPLETE,(function (evt){
return goog.dom.getElement("logoDiv").innerHTML = evt.target.getResponseText();
}));
xhr.send("http://www.sym-log.com/docstub.xml");
xhb.setResponseType(goog.net.XhrIo.ResponseType.BLOB);
goog.events.listenOnce(xhb,goog.net.EventType.COMPLETE,(function (evt){
var type = evt.target.getResponse().type;
var blob = evt.target.getResponse();
var db = (new mock1.pouchDB("testdb"));
return db.DB.put({"_id":"otherdoc2","title":"hearts"},(function (err__$1,resp){
return db.DB.putAttachment("otherdoc2/ablob",resp.rev,blob,type,(function (err__$2,resp__$1){
return console.log("done");
}));
}));
}));
return xhb.send("http://www.sym-log.com/images/flights.png");
}
}));
(new goog.ui.InputDatePicker(formatter,parser)).decorate(goog.dom.getElement("departureDateField"));
(new goog.ui.InputDatePicker(formatter,parser)).decorate(goog.dom.getElement("arrivalDateField"));
cb1.render(goog.dom.getElement("departingDiv"));
cb2.render(goog.dom.getElement("arrivingDiv"));
window.onbeforeunload = (function (){
return goog.disposeAll((function (){var G__9499 = [];
G__9499.push(cb1);
G__9499.push(cb2);
return G__9499;
})());
});
goog.events.listen(cb1,"change",mock1.cb1_change_event_handler);
return goog.events.listen(cb2,"change",mock1.cb2_change_event_handler);
});
