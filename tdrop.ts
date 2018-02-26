import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ToastController,
  Platform, LoadingController, ModalController
} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Geolocation } from "@ionic-native/geolocation";
import { Loading } from 'ionic-angular/components/loading/loading';
import { makeDecorator } from '@angular/core/src/util/decorators';
import { OrderModalComponent } from "../../components/order-modal/order-modal";
import { GooglemapProvider } from "../../providers/googlemap/googlemap";
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

//declare var google;
declare var plugin;

@IonicPage()
@Component({
  selector: 'page-tdrop',
  templateUrl: 'tdrop.html',
})
export class TdropPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  // map:GoogleMap ;
  mygeoLat: number = -7.25747;
  mygeoLng: number = 112.752;
  mylatLng;
  private tdropData: FormGroup;
  dataRider = [];
  public loading = this.loadCtrl.create({
    content: 'Please wait the Map'
  });
  geoloctemp;
  testgeodata;
  geoResult;

  constructor(public navCtrl: NavController,
    private platform: Platform,
    public navParams: NavParams,
    public mdlCtrl: ModalController,
    public geolocation: Geolocation,
    public nativeGeo: NativeGeocoder,
    private gmapSvc: GooglemapProvider,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private fb: FormBuilder) {
    platform.ready().then(() => {
      this.getcurrentLocation();
    })
    this.initForm();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TdropPage');
    //this.getcurrentLocation();
    // this.loadMap();


  }
  initForm() {
    this.tdropData = this.fb.group({
      dariLokasi: ['', Validators.required],
      dariDetail: [''],
      keLokasi: ['', Validators.required],
      keDetail: ['']
    })
  }

  getcurrentLocation() {
    this.loading.present();
    let options = {
      timeout: 6000,
      enableHighAccuracy: true
    };
    plugin.google.maps.LocationService.getMyLocation(options, (location) => {
      this.loading.dismiss();
      this.mylatLng = location.latLng;
      this.presentToast(this.mylatLng);
      this.mapinit();
    })
  }

  mapinit() {
    const div = document.getElementById("mapCanvas");
    let map = plugin.google.maps.Map.getMap(div, {
      controls: {
        myLocationButton: true,
        myLocation: true,
        compass: true,
      },
      gestures: {
        scroll: true,
        rotate: true
      },
      camera: {
        target: this.mylatLng,
        zoom: 16,
        tilt: 30
      }
    });
    map.addEventListener(plugin.google.maps.event.MAP_READY, () => {
      // i will take this data from service later
      const mdata = [
        {
          position: { lng: 112.6106998, lat: -7.24393739 },
          title: "driver1"
        },
        {
          position: { lng: 112.61472816, lat: -7.24396974 },
          title: "driver2"
        },
        {
          position: { lng: 112.61332594, lat: -7.243510064 },
          title: "driver3"
        }

      ]
      let baseArrayClass = new plugin.google.maps.BaseArrayClass(mdata);
      baseArrayClass.map((options, cb) => {

        options.mytitle = options.title;
        delete options.title;
        map.addMarker(options, cb);

      }, (markers) => {
        console.log(markers[0]);
        var htmlInfoWindow = new plugin.google.maps.HtmlInfoWindow();

        markers.forEach((marker) => {
          marker.on(plugin.google.maps.event.MARKER_CLICK, () => {
            htmlInfoWindow.setContent(marker.get("mytitle"));
            htmlInfoWindow.open(marker);
          });
        });

      });
      let self = this;
      map.on(plugin.google.maps.event.CAMERA_MOVE_START, self.onCameraEvents);
      map.on(plugin.google.maps.event.CAMERA_MOVE, this.cekevent);
      map.on(plugin.google.maps.event.CAMERA_MOVE_END, (latLng) => {
        let map = this;
        self.onCameraEvents(latLng)
      });
      map.setCenter(this.mylatLng);
    });
  }

  getNearRider() {


  }
  cekevent() {
    let message = "cek event touched";
    this.geoloctemp = message;
  }
  onCameraEvents(cameraPosition) {
    let fields = {
      "lat": document.getElementById("lat"),
      "lng": document.getElementById("lng"),
      "latlng": document.getElementById("latlng")
    }
    fields.lat.innerText = cameraPosition.target.lat;
    fields.lng.innerText = cameraPosition.target.lng;
    fields.latlng.innerText = cameraPosition.target.lat + ',' + cameraPosition.target.lng;
    let latLng = cameraPosition.target.lat + ',' + cameraPosition.target.lng;
    // reverse geocode to get address
    plugin.google.maps.Geocoder.geocode({
      "position": latLng
    }, function (results) {

      if (results.length === 0) {
        // Not found
        return;
      }

      var address = [
        results[0].subThoroughfare || "",
        results[0].thoroughfare || "",
        results[0].locality || "",
        results[0].adminArea || "",
        results[0].postalCode || "",
        results[0].country || ""].join(", ");

      this.presentToast(address);
      // marker.setTitle(address)
      //     .showInfoWindow();
    });
  }

  searchLocation(latLng) {

  }

  showModal() {
    let optsModal = { enableBackdropDismiss: false }
    let discModal = this.mdlCtrl.create(OrderModalComponent, {}, optsModal);
    discModal.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }

}
