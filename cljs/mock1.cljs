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
            [goog.debug.DivConsole]
            [goog.fx.AnimationParallelQueue]
            ))


(def slideWidth 518)
(def slideIndex (atom 0))

(goog.inherits (defn pouchDB [dbName]
 (this-as this
    (goog.events.EventTarget.call this)
    (set! (. js.Pouch -enableAllDbs) true)
    
    (set! (. this -DB) (js.Pouch. dbName))

    (set! (. this -getAllDocs)
          (fn [] (. (. this -DB) allDocs (js-obj "include_docs" true)
                    (fn [err resp] (do
                                     (set! (. this -docList) resp)
                                     (. this dispatchEvent "docsReady"))))))
    
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


(defn getBookings [dbname]
  (let [ db (mock1/pouchDB. "testdb2") ]
    (goog.events.listenOnce db "docsReady"
               (fn [evt]
                 (let [ docArray (.-rows (.-docList (.-target evt))) ]
                    (.forEach docArray
                       (fn [elem idx arr]
                         (let [ nNode (.cloneNode (goog.dom.getElement "sliderTemplate") "deep") 
                               nChilds (goog.dom.getChildren nNode) ]

         (set! (. (aget nChilds 2) -innerHTML) (.-departing (.-doc elem)))
         (set! (. (aget nChilds 4) -innerHTML) (.-arriving (.-doc elem)))
         (set! (. (aget nChilds 6) -innerHTML) (.-dDate (.-doc elem)))
         (set! (. (aget nChilds 8) -innerHTML) (.-aDate (.-doc elem)))
         (set! (.-display (.-style nNode)) "inline")
         (set! (.-className nNode) "slide")
         (goog.dom.appendChild (goog.dom.getElement "actionWindow") nNode)))))))

    (.getAllDocs db)))


(defn cb1-change-event-handler [evt]
  (let [node (goog.dom.getElement "departureWeatherDiv")]
    (set! (. (. node -style) -border) "1px solid gray")
    (resizeDomNode 240 30 node)
    (fadeinNode (goog.dom.getElement "floatingCirclesGone"))
    (fadeinNode (goog.dom.getElement "text1"))
    (fadeoutNode (goog.dom.getElement "floatingCirclesGone"))
    (set! (. bookingData -departing) (.getValue (.-target evt)))

   ))

(defn cb2-change-event-handler [evt]
  (let [node (goog.dom.getElement "arrivalWeatherDiv")]
    (set! (. (. node -style) -border) "1px solid gray")
    (resizeDomNode 240 30 node )
    (fadeinNode (goog.dom.getElement "floatingCirclesGtwo"))
    (fadeinNode (goog.dom.getElement "text2"))
    (fadeoutNode (goog.dom.getElement "floatingCirclesGtwo"))
    (set! (. bookingData -arriving) (.getValue (.-target evt)))
   ))


(defn bookFlight [dbase]
  (let [ nNode (.cloneNode (goog.dom.getElement "sliderTemplate") "deep")
        db (mock1/pouchDB. "testdb2")
        nChilds (goog.dom.getChildren nNode)
        bookObj  (js-obj "departing" (. mock1/bookingData -departing)
                         "dDate" (. (goog.dom.getElement "departureDateField") -value)
                         "arriving"  (. mock1/bookingData -arriving)
                         "aDate" (. (goog.dom.getElement "arrivalDateField") -value))   ]

    (set! (. (aget nChilds 2) -innerHTML) (.-departing bookObj))
    (set! (. (aget nChilds 4) -innerHTML) (.-arriving bookObj)) 
    (set! (. (aget nChilds 6) -innerHTML) (.-dDate bookObj))
    (set! (. (aget nChilds 8) -innerHTML) (.-aDate bookObj))
    (set! (.-display (.-style nNode)) "inline")
    (set! (.-className nNode) "slide")

    (.post (.-DB db) bookObj
           (fn [err resp] (goog.dom.appendChild (goog.dom.getElement "actionWindow") nNode)))
    ))

(defn load-flight-confirmation []
  (bookFlight "testdb2"))


(defn appInit []

  (def bookingData (js-obj))
  
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
               (.send xhr "http://localhost:8080/docstub.xml")
               (.setResponseType xhb (. goog.net.XhrIo.ResponseType -BLOB))
               (goog.events.listenOnce xhb goog.net.EventType.COMPLETE
                   (fn [evt] (let [type (. (.getResponse (. evt -target)) -type)
                                   blob (.getResponse (. evt -target))
                                   db (pouchDB. "testdb") ]
                                (.put (. db -DB) (js-obj "_id" "otherdoc2" "title" "hearts")
                                    (fn [err resp] (.putAttachment (. db -DB) "otherdoc2/ablob"
                          (. resp -rev) blob type  (fn [err resp] (js.console.log "done"))))))))
                (.send xhb "http://localhost:8080/images/flights.png"))
    )))


    (.decorate (goog.ui.InputDatePicker. formatter parser)
         (goog.dom.getElement "departureDateField"))
     
    (.decorate (goog.ui.InputDatePicker. formatter parser)
             (goog.dom.getElement "arrivalDateField"))

    (.render cb1 (goog.dom.getElement "departingDiv"))  
    (.render cb2 (goog.dom.getElement "arrivingDiv"))

    (set! (. js.window -onbeforeunload)
          (fn [] (goog.disposeAll(doto (array) (.push cb1) (.push cb2)))))


    (getBookings "testdb2")

    (goog.events.listen cb1 "change" cb1-change-event-handler)
    (goog.events.listen cb2 "change" cb2-change-event-handler)

    (goog.events.listen (goog.dom.getElement "right-pointer") goog.events.EventType.CLICK              (fn [evt] 
                   (let [ slides (goog.dom.getElementsByTagNameAndClass nil "slide") ]
                     (. evt preventDefault)
                     (reset! slideIndex (goog.math.modulo (swap! slideIndex inc)
                                                          (. slides -length)))
                    
                     (goog.array.forEach slides
                           (fn [ slide idx ]
                              (goog.style.setStyle slide "left" (str (+ (* -1 @slideIndex     slideWidth) (* idx slideWidth))"px")))))))


     (goog.events.listen (goog.dom.getElement "left-pointer") goog.events.EventType.CLICK              (fn [evt] 
                   (let [ slides (goog.dom.getElementsByTagNameAndClass nil "slide") ]
                     (. evt preventDefault)
                     (reset! slideIndex (goog.math.modulo (swap! slideIndex dec)
                                                           (. slides -length)))

                     (goog.array.forEach slides
                           (fn [ slide idx ]
                              (goog.style.setStyle slide "left" (str (+ (* -1 @slideIndex     slideWidth) (* idx slideWidth))"px")))))))




    
    ) )
