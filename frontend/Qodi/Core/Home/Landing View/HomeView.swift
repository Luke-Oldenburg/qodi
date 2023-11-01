//
//  ScannerView.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/6/23.
//

import SwiftUI

struct HomeView: View {
    
    // Observe barcode data from BarcodeData class view model
    @ObservedObject var barcodeData: BarcodeData
    @State private var isAnimating: Bool = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Initiate camera preview layer
                BarcodeScannerRepresentable(barcodeData: barcodeData)
                    .onAppear(perform: {
                                        // Start the scanning session when the view appears
                                        (UIApplication.shared.windows.first?.rootViewController as? ViewController)?.startScanning()
                                    })
                    .ignoresSafeArea()
                
                // Show scanning guide
                RoundedRectangle(cornerRadius: 10)
                    .stroke(lineWidth: 4)
                    .foregroundColor(.qodiGreen)
                    .frame(width: 250, height: 250)
                    .opacity(isAnimating ? 0.5 : 1.0)
                
                // Create button that has an animation
                VStack {
                    Spacer()
                    Button(action: {
                        isAnimating = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                            isAnimating = false
                            
                            if let potentialCode = barcodeData.potentialScannedCode {
                                barcodeData.lastScannedCode = potentialCode
                            } else {
                                barcodeData.provideFeedback()
                            }
                        }
                    }) {
                        ZStack{
                            Circle()
                                .fill(Color.qodiGreen)
                                .frame(width: 100, height: 100)
                            Image(systemName: "barcode.viewfinder")
                                .font(.system(size: 40))
                                .foregroundColor(.white)
                                
                        }
                        .opacity(isAnimating ? 0.5 : 1.0)
                    }
                    .padding(.bottom)
                    
                }
                // Navigate to the next view based on shouldNavigate bool
                .navigationDestination(isPresented: $barcodeData.shouldNavigate) { ResultView(barcodeData: barcodeData)
                }
            }
        }
        
    }
}

#Preview {
    HomeView(barcodeData: BarcodeData())
}

