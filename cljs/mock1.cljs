(ns mock1
  (:require [goog.fx  :as fx]
            [goog.fx.dom :as fx.dom]
            [goog.ui.ComboBox]
            [goog.date]
            [goog.i18n.DateTimeSymbols]
            [goog.i18n.DateTimeSymbols_en_US]
            [goog.ui.DatePicker]
            [goog.ui.InputDatePicker]
            [goog.i18n.DateTimeParse]
            [goog.net.XhrIo]
            ))

(goog.inherits (defn pouchDB [dbName]
  (this-as this
    (goog.events.EventTarget.call this)
    (set! (. js.Pouch -enableAllDbs) true)
    
    (set! (. this -DB) (js.Pouch. dbName))
    (set! (. this -getAttachment)
          (fn [docId] (. (. this -DB) getAttachment docId
                         (fn [err resp] (do
                                          (set! (. this -response) resp)
                                          (. this dispatchEvent "docReady"))))))
    (set! (. this -getResponse) (fn [] (. this -response)))
    this)) goog.events.EventTarget)

(defn resizeDomNode [ toWidth toHeight node ]
  (let [ w (. node -offsetWidth)
         h (. node -offsetHeight) ]
    (.play (goog.fx.dom.Resize.
            node
           (array w h)
           (array toWidth toHeight)
            250
            (goog.fx.easing.easeOut)))
 ))

(defn createComboBox [title]
  (let [ cb (goog.ui.ComboBox.) ]
    (doto cb
     (.setUseDropdownArrow true) 
     (.addItem (goog.ui.ComboBoxItem. "San Francisco"))
     (.addItem (goog.ui.ComboBoxItem. "New York"))
     (.addItem (goog.ui.ComboBoxItem. "Houston"))
     (.addItem (goog.ui.ComboBoxItem. "Miami"))
     (.addItem (goog.ui.ComboBoxItem. "Boston"))
     (.addItem (goog.ui.ComboBoxItem. "Los Angeles"))
     (.addItem (goog.ui.ComboBoxItem. "Honolulu"))
     (.addItem (goog.ui.ComboBoxItem. "Dallas"))
     )
   cb)) 

(defn fadeoutNode [node]
  (.play (goog.fx.dom.FadeOutAndHide. node 1500)))

(defn fadeinNode [node]
  (.play (goog.fx.dom.FadeInAndShow. node 1500)))

(defn cb1-change-event-handler [evt]
  (let [node (goog.dom.getElement "departureWeatherDiv")]
    (set! (. (. node -style) -border) "1px solid gray")
    (resizeDomNode 240 30 node)
    (fadeinNode (goog.dom.getElement "floatingCirclesGone"))
    (fadeinNode (goog.dom.getElement "text1"))
    (fadeoutNode (goog.dom.getElement "floatingCirclesGone"))
   ))

(defn cb2-change-event-handler [evt]
  (let [node (goog.dom.getElement "arrivalWeatherDiv")]
    (set! (. (. node -style) -border) "1px solid gray")
    (resizeDomNode 240 30 node )
    (fadeinNode (goog.dom.getElement "floatingCirclesGtwo"))
    (fadeinNode (goog.dom.getElement "text2"))
    (fadeoutNode (goog.dom.getElement "floatingCirclesGtwo"))
   ))

(defn load-flight-confirmation []
  (do
    (fadeinNode (goog.dom.getElement "circleLoadDiv"))
    (fadeinNode (goog.dom.getElement "contentDiv"))
    (fadeoutNode (goog.dom.getElement "circleLoadDiv"))
   ))
    

(defn appInit []

  (let [ pattern  "MM/dd/yyyy"
         formatter (goog.i18n.DateTimeFormat. pattern)
         parser (goog.i18n.DateTimeParse. pattern)
         cb1  (createComboBox "Departing City...")
         cb2  (createComboBox "Arrival City...")   ]

   (Pouch.allDbs (fn [err response]
     (if-not (= -1 (.indexOf response "testdb"))
                   
          (let [ db (pouchDB. "testdb") ]
             (goog.events.listenOnce db "docReady"
                (fn [evt] (let [ nNode (goog.dom.createElement "img")
                             blob (. (. evt -target)-response) ]
                             (set! (. nNode -src) (goog.global.URL.createObjectURL blob))
                             (.appendChild (goog.dom.getElement "logoDiv") nNode))))
              (. db getAttachment "otherdoc2/ablob"))
                   
          (let [ xhr (goog.net.XhrIo.)
                 xhb (goog.net.XhrIo.) ] 
               (goog.events.listenOnce xhr goog.net.EventType.COMPLETE
                   (fn [evt] (set! (.-innerHTML (goog.dom.getElement "logoDiv"))
                              (.getResponseText (. evt -target)))))
               (.send xhr "http://www.sym-log.com/docstub.xml")
               (.setResponseType xhb (. goog.net.XhrIo.ResponseType -BLOB))
               (goog.events.listenOnce xhb goog.net.EventType.COMPLETE
                   (fn [evt] (let [type (. (.getResponse (. evt -target)) -type)
                                   blob (.getResponse (. evt -target))
                                   db (pouchDB. "testdb") ]
                                (.put (. db -DB) (js-obj "_id" "otherdoc2" "title" "hearts")
                                    (fn [err resp] (.putAttachment (. db -DB) "otherdoc2/ablob"
                           (. resp -rev) blob type  (fn [err resp] (js.console.log "done"))))))))
                (.send xhb "http://www.sym-log.com/images/flights.png"))
    )))


    (.decorate (goog.ui.InputDatePicker. formatter parser)
         (goog.dom.getElement "departureDateField"))
     
    (.decorate (goog.ui.InputDatePicker. formatter parser)
             (goog.dom.getElement "arrivalDateField"))

    (.render cb1 (goog.dom.getElement "departingDiv"))  
    (.render cb2 (goog.dom.getElement "arrivingDiv"))

    (set! (. js.window -onbeforeunload)
          (fn [] (goog.disposeAll(doto (array) (.push cb1) (.push cb2)))))

    (goog.events.listen cb1 "change" cb1-change-event-handler)
    (goog.events.listen cb2 "change" cb2-change-event-handler)
 
    ) )
