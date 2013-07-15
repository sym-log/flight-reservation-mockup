goog.provide('mock1');
goog.require('cljs.core');
goog.require('goog.fx.dom');
goog.require('goog.fx.AnimationParallelQueue');
goog.require('goog.debug.DivConsole');
goog.require('goog.i18n.DateTimeSymbols_en_US');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.i18n.DateTimeParse');
goog.require('goog.net.XhrIo');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.DatePicker');
goog.require('goog.date');
goog.require('goog.ui.InputDatePicker');
goog.require('goog.fx');
mock1.slideWidth = 518;
mock1.slideIndex = cljs.core.atom.call(null,0);
goog.inherits(mock1.pouchDB = (function pouchDB(dbName){
var this$ = this;
goog.events.EventTarget.call(this$);
Pouch.enableAllDbs = true;
this$.DB = (new Pouch(dbName));
this$.getAllDocs = (function (){
return this$.DB.allDocs({"include_docs":true},(function (err,resp){
this$.docList = resp;
return this$.dispatchEvent("docsReady");
}));
});
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
var G__12315_12316 = cb;
G__12315_12316.setUseDropdownArrow(true);
G__12315_12316.addItem((new goog.ui.ComboBoxItem("San Francisco")));
G__12315_12316.addItem((new goog.ui.ComboBoxItem("New York")));
G__12315_12316.addItem((new goog.ui.ComboBoxItem("Houston")));
G__12315_12316.addItem((new goog.ui.ComboBoxItem("Miami")));
G__12315_12316.addItem((new goog.ui.ComboBoxItem("Boston")));
G__12315_12316.addItem((new goog.ui.ComboBoxItem("Los Angeles")));
G__12315_12316.addItem((new goog.ui.ComboBoxItem("Honolulu")));
G__12315_12316.addItem((new goog.ui.ComboBoxItem("Dallas")));
return cb;
});
mock1.fadeoutNode = (function fadeoutNode(node){
return (new goog.fx.dom.FadeOutAndHide(node,1500)).play();
});
mock1.fadeinNode = (function fadeinNode(node){
return (new goog.fx.dom.FadeInAndShow(node,1500)).play();
});
mock1.getBookings = (function getBookings(dbname){
var db = (new mock1.pouchDB("testdb2"));
goog.events.listenOnce(db,"docsReady",(function (evt){
var docArray = evt.target.docList.rows;
return docArray.forEach((function (elem,idx,arr){
var nNode = goog.dom.getElement("sliderTemplate").cloneNode("deep");
var nChilds = goog.dom.getChildren(nNode);
(nChilds[2]).innerHTML = elem.doc.departing;
(nChilds[4]).innerHTML = elem.doc.arriving;
(nChilds[6]).innerHTML = elem.doc.dDate;
(nChilds[8]).innerHTML = elem.doc.aDate;
nNode.style.display = "inline";
nNode.className = "slide";
return goog.dom.appendChild(goog.dom.getElement("actionWindow"),nNode);
}));
}));
return db.getAllDocs();
});
mock1.cb1_change_event_handler = (function cb1_change_event_handler(evt){
var node = goog.dom.getElement("departureWeatherDiv");
node.style.border = "1px solid gray";
mock1.resizeDomNode.call(null,240,30,node);
mock1.fadeinNode.call(null,goog.dom.getElement("floatingCirclesGone"));
mock1.fadeinNode.call(null,goog.dom.getElement("text1"));
mock1.fadeoutNode.call(null,goog.dom.getElement("floatingCirclesGone"));
return mock1.bookingData.departing = evt.target.getValue();
});
mock1.cb2_change_event_handler = (function cb2_change_event_handler(evt){
var node = goog.dom.getElement("arrivalWeatherDiv");
node.style.border = "1px solid gray";
mock1.resizeDomNode.call(null,240,30,node);
mock1.fadeinNode.call(null,goog.dom.getElement("floatingCirclesGtwo"));
mock1.fadeinNode.call(null,goog.dom.getElement("text2"));
mock1.fadeoutNode.call(null,goog.dom.getElement("floatingCirclesGtwo"));
return mock1.bookingData.arriving = evt.target.getValue();
});
mock1.bookFlight = (function bookFlight(dbase){
var nNode = goog.dom.getElement("sliderTemplate").cloneNode("deep");
var db = (new mock1.pouchDB("testdb2"));
var nChilds = goog.dom.getChildren(nNode);
var bookObj = {"departing":mock1.bookingData.departing,"dDate":goog.dom.getElement("departureDateField").value,"arriving":mock1.bookingData.arriving,"aDate":goog.dom.getElement("arrivalDateField").value};
(nChilds[2]).innerHTML = bookObj.departing;
(nChilds[4]).innerHTML = bookObj.arriving;
(nChilds[6]).innerHTML = bookObj.dDate;
(nChilds[8]).innerHTML = bookObj.aDate;
nNode.style.display = "inline";
nNode.className = "slide";
return db.DB.post(bookObj,(function (err,resp){
return goog.dom.appendChild(goog.dom.getElement("actionWindow"),nNode);
}));
});
mock1.load_flight_confirmation = (function load_flight_confirmation(){
return mock1.bookFlight.call(null,"testdb2");
});
mock1.appInit = (function appInit(){
mock1.bookingData = {};
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
xhr.send("http://localhost:8080/docstub.xml");
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
return xhb.send("http://localhost:8080/images/flights.png");
}
}));
(new goog.ui.InputDatePicker(formatter,parser)).decorate(goog.dom.getElement("departureDateField"));
(new goog.ui.InputDatePicker(formatter,parser)).decorate(goog.dom.getElement("arrivalDateField"));
cb1.render(goog.dom.getElement("departingDiv"));
cb2.render(goog.dom.getElement("arrivingDiv"));
window.onbeforeunload = (function (){
return goog.disposeAll((function (){var G__12318 = [];
G__12318.push(cb1);
G__12318.push(cb2);
return G__12318;
})());
});
mock1.getBookings.call(null,"testdb2");
goog.events.listen(cb1,"change",mock1.cb1_change_event_handler);
goog.events.listen(cb2,"change",mock1.cb2_change_event_handler);
goog.events.listen(goog.dom.getElement("right-pointer"),goog.events.EventType.CLICK,(function (evt){
var slides = goog.dom.getElementsByTagNameAndClass(null,"slide");
evt.preventDefault();
cljs.core.reset_BANG_.call(null,mock1.slideIndex,goog.math.modulo(cljs.core.swap_BANG_.call(null,mock1.slideIndex,cljs.core.inc),slides.length));
return goog.array.forEach(slides,(function (slide,idx){
return goog.style.setStyle(slide,"left",[cljs.core.str((((-1 * cljs.core.deref.call(null,mock1.slideIndex)) * mock1.slideWidth) + (idx * mock1.slideWidth))),cljs.core.str("px")].join(''));
}));
}));
return goog.events.listen(goog.dom.getElement("left-pointer"),goog.events.EventType.CLICK,(function (evt){
var slides = goog.dom.getElementsByTagNameAndClass(null,"slide");
evt.preventDefault();
cljs.core.reset_BANG_.call(null,mock1.slideIndex,goog.math.modulo(cljs.core.swap_BANG_.call(null,mock1.slideIndex,cljs.core.dec),slides.length));
return goog.array.forEach(slides,(function (slide,idx){
return goog.style.setStyle(slide,"left",[cljs.core.str((((-1 * cljs.core.deref.call(null,mock1.slideIndex)) * mock1.slideWidth) + (idx * mock1.slideWidth))),cljs.core.str("px")].join(''));
}));
}));
});
