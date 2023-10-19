//
//  FinalOnboardingPage.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/6/23.
//

import SwiftUI

// Configurable final onboarding page with button to stop re-onboarding

struct finalOnboardView: View{
    let systemImageName: String
    let title: String
    let description: String
    @Binding var userOnboarded: Bool
    
    var body: some View{
        VStack(spacing: 20){
            
            Image(systemName: systemImageName)
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundStyle(.white)
            
            Text(title)
                .font(.title)
                .fontWeight(.bold)
                .foregroundStyle(.white)
            
            Text(description)
                .multilineTextAlignment(.center)
                .foregroundStyle(.white)
            
            Button(action: {
                userOnboarded = true
            }, label: {
                Text("Start Scanning")
                    .foregroundStyle(.white)
                    .frame(width: 300, height: 45)
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
