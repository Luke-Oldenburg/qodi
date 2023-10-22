//
//  SplashScreen.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/6/23.
//  Screen that the user sees every time the app is launched
// Changes to be made************
// Create an asset called Qodi.green to set as background color
// Create an app icon for the app
// Use that app icon here for the splash screen
// Change the font of "Qodi" to poppins
// Make the image resizable, scaled to fit, and have a frame instead of using font size.
// Maybe remove the with animation code block and move self.isActive = true to stay in the dispatch queue, not in with animation code block

import SwiftUI

struct SplashScreenView: View {
    @State private var size = 0.8
    @State private var isActive = false
    
    var body: some View {
        if isActive == true {
            OnboardingView()
        } else {
            ZStack{
                Color.green
                    .ignoresSafeArea()
                VStack{
                    Image(systemName: "barcode.viewfinder")
                        .font(.system(size: 100))
                    
                    Text("Qodi")
                        .font(.system(size: 40))
                        .padding(.top, 5)
                        .fontWeight(.semibold)
                }
                .foregroundStyle(.white)
                .scaleEffect(size)
                .onAppear{
                    withAnimation(.easeIn(duration: 1.2)){
                        self.size = 1.0
                    }
                    
                }
                
            }
            .onAppear{
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                    withAnimation {
                        self.isActive = true
                    }
                    
                }
            }
        }
        
        
    }
}

#Preview {
    SplashScreenView()
}
