//
//  FinalOnboardingPage.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/6/23.
//

import SwiftUI

// Configurable final onboarding page with button to finish onboarding and move user to home screen
// Button will also prevent user from being onboarded again.

struct finalOnboardView: View{
    // Paramaters for view
    let systemImageName: String
    let title: String
    let description: String
    @Binding var userOnboarded: Bool
    
    var body: some View{
        VStack(spacing: 20){
            
            // Icon image for onboarding
            Image(systemName: systemImageName)
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundStyle(.white)
            
            // Title
            Text(title)
                .font(.title)
                .fontWeight(.bold)
                .foregroundStyle(.white)
            
            // Description
            Text(description)
                .multilineTextAlignment(.center)
                .foregroundStyle(.white)
            
            // Button action
            Button(action: {
                userOnboarded = true
                
                // Button label
            }, label: {
                Text("Start Scanning")
                    .frame(width: 300, height: 45)
                    .foregroundStyle(.white)
                    .fontWeight(.semibold)
                    .background(.gray)
                    .cornerRadius(8)
                    .padding(.top, 20)
                    .font(.system(size: 20))
            })
            
        }
        .padding(.horizontal, 40)
    }
}
