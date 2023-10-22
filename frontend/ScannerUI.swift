//
//  Scanner.swift
//  Verascan
//
//  Created by Miyaz Ansari on 7/19/23.
//
import SwiftUI

struct BarcodeScannerView: View {
    @State private var scannedBarcode: String = ""
    @State private var isScanning = false

    var body: some View {
        VStack {
            ScannerRepresentable(scannedBarcode: $scannedBarcode, isScanning: $isScanning)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            Text("Scanned Barcode: \(scannedBarcode)")
                .padding()
        }
        .onAppear {
            self.isScanning = true
        }
        .onDisappear {
            self.isScanning = false
        }
    }
}



