//
//  BarcodeData.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/23/23.
//

import SwiftUI
import Combine
// Create class to store barcode data and important variables. 
class BarcodeData: ObservableObject {
    @Published var lastScannedCode: String? {
        didSet {
            if let _ = lastScannedCode {
                shouldNavigate = true
            }
        }
    }

    @Published var feedbackMessage: String?
    @Published var shouldNavigate: Bool = false
    @Published var shouldScan: Bool = true
    @Published var potentialScannedCode: String?

    func reset() {
        shouldNavigate = false
        lastScannedCode = nil
        feedbackMessage = nil
        shouldScan = true
    }
    
    func provideFeedback() {
        feedbackMessage = "Ensure barcode is clear and well-lit"
    }
}

