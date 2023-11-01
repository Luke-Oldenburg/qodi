//
//  SplashScreen.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/6/23.
//  Screen that the user sees every time the app is launched

// Create an app icon for the app

// Splash screen that launches when the app is opened

import SwiftUI


struct SplashScreenView: View {
    
    // Variables used by the view
    @State private var size = 0.8
    @State private var isActive = false
    
    var body: some View {
        
        // Go to onbarding view once splash screen is over and app is lauched
        // From there, display onboarding or not depending on userOnboarded Bool
        if isActive == true {
            OnboardingView()
        } else {
            ZStack{
                Color.qodiGreen
                    .ignoresSafeArea()
                VStack{
                    
                    // Icon
                    Image(systemName: "barcode.viewfinder")
                        .font(.system(size: 100))
                    
                    // Text
                    Text("Qodi")
                        .font(.system(size: 40))
                        .padding(.top, 5)
                        .fontWeight(.semibold)
                }
                
                .foregroundStyle(.white)
                .scaleEffect(size)
                
                // Animate using size variables when view appears
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


// Provide preview for development purposes
#Preview {
    SplashScreenView()
}
