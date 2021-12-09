import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Geojson, Marker} from 'react-native-maps';

export default function ShowMap(props) {
    const {areas} = props;
    console.log(areas);

    return (
        <MapView
        style={{ flex:1 }}
        initialRegion={{
          latitude:60.171520647632406,
          longitude:24.95095348096506,
          latitudeDelta:0.0322,
          longitudeDelta:0.0221,}} >
            {console.log('moi')}
            {/*
            areas.map((area,index)=>
                {console.log(area.features[0]),
                <Geojson 
                key={index}
                geojson={{
                  type: area.type,
                  features: area.features
                }}
              strokeColor='blue'/>}
            )
              
            <Geojson 
            geojson= {areas}
            strokeColor='blue' />*/}
           
            <Geojson
            geojson= {{
              type: 'FeatureCollection',
              features: [
                {geometry: {
                  type: 'MultiPolygon',
                  coordinates: [
                    [
                        [
                            [
                                
                              24.95095348096506,
                              60.171520647632406, 
                            ],
                            [
                                
                              24.9509556803676,
                              60.17150419982532, 
                            ],
                            [
                                
                              24.951907565280848,
                              60.171534655463105,
                            ],
                            [
                                
                              24.951905353253338,
                              60.17155181966475, 
                            ],
                            [
                                
                              24.951552974429124,
                              60.17154054607087,
                            ],
                            [
                                24.95095348096506,
                                60.171520647632406
                            ]
                        ]
                    ]
                ]}
                },
                {
                  "id": "5e9398b9-0b55-4e12-8376-3246d7f6bbba",
                  "type": "Feature",
                  "geometry": {
                      "coordinates": [
                          [
                              [
                                  [
                                      
                                    24.952267526407198,
                                    60.17150364378772,
                                  ],
                                  [
                                      24.952269290615902,
                                      60.17149077900347
                                  ],
                                  [
                                      24.952296916829102,
                                      60.17149171945856
                                  ],
                                  [
                                      24.953119948766968,
                                      60.17152034840436
                                  ],
                                  [
                                      24.953118143536688,
                                      60.17153323236579
                                  ],
                                  [
                                      24.952267526407198,
                                      60.17150364378772
                                  ]
                              ]
                          ]
                      ],
                      "type": "MultiPolygon"
                  },
                  "properties": {
                      "capacity_estimate": null
                  }
              },
              ]
            }}
            strokeColor='red'></Geojson>
            <Marker 
            coordinate={{
              latitude: 24.952267526407198,
              longitude: 60.17150364378772
            }}/>
        </MapView>
      );
}