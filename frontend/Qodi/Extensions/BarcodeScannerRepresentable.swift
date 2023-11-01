//
//  BarcodeScannerRepresentable.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/23/23.
//

import SwiftUI
import UIKit


// Create represntable to use in UI

struct BarcodeScannerRepresentable: UIViewControllerRepresentable {
    @ObservedObject var barcodeData: BarcodeData
    
    func makeUIViewController(context: Context) -> ViewController {
        return ViewController(barcodeData: barcodeData)
    }
    
    func updateUIViewController(_ uiViewController: ViewController, context: Context) {
        if barcodeData.shouldScan {
            uiViewController.startScanning()
        } else {
            uiViewController.stopScanning()
        }
    }
}
