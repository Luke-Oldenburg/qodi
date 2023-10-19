//
//  OnboardingViewPages.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/6/23.
//

import SwiftUI

// Configurable view used for creating starting onboarding information
struct OnboardView: View {
    
    let systemImageName: String
    let title: String
    let description: String
    
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
        }
        .padding(.horizontal, 40)
    }
}
