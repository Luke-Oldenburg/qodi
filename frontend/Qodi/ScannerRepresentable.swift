//
//  ScannerRepresentable.swift
//  Qodi
//
//  Created by Miyaz Ansari on 7/25/23.
//

import SwiftUI

struct ScannerRepresentable: UIViewControllerRepresentable {
    @Binding var scannedBarcode: String
    @Binding var isScanning: Bool

    func makeUIViewController(context: Context) -> ScannerViewController {
        let scannerViewController = ScannerViewController()
        scannerViewController.delegate = context.coordinator
        return scannerViewController
    }

    func updateUIViewController(_ uiViewController: ScannerViewController, context: Context) {
        // Update any necessary properties of the ScannerViewController here if needed
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(scannedBarcode: $scannedBarcode, isScanning: $isScanning)
    }

    class Coordinator: NSObject, ScannerViewControllerDelegate {
        @Binding var scannedBarcode: String
        @Binding var isScanning: Bool

        init(scannedBarcode: Binding<String>, isScanning: Binding<Bool>) {
            _scannedBarcode = scannedBarcode
            _isScanning = isScanning
        }

        func didDetectBarcode(_ barcode: String) {
            scannedBarcode = barcode
            isScanning = false
        }
    }
}


