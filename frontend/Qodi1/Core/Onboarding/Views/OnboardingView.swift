//
//  OnboardingView.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/6/23.
//  Make more refined descriptions for onboarding purposes
//  Change the background color to be Qodi Green
//  Change the gray on the final onboarding page button to a nicer color
//Figure out how to see this view again

import SwiftUI

struct OnboardingView: View {
    @AppStorage("userOnboarded") var userOnboarded: Bool = false
    
    var body: some View {
        if userOnboarded{
            HomeView()
        } else {
            
            ZStack{
                Color.green
                    .ignoresSafeArea()
                TabView{
                    OnboardView(systemImageName: "questionmark",
                                title: "Complex Additives",
                                description: "Have you ever wondered what the those ingredients are on the back of food boxes? (ex. soy lecthin)")
                    
                    OnboardView(systemImageName:"barcode.viewfinder",
                                title: "Scan to find out",
                                description: "Learn about these additives and their possible health implications just by scanning the barcode")
                    
                    finalOnboardView(systemImageName: "chart.bar.doc.horizontal",
                                     title: "Ingredients Summary",
                                     description: "After you scan your food item, you will get a comprehensive breakdown on the food additives",
                                     userOnboarded: $userOnboarded)
                }
                .tabViewStyle(.page(indexDisplayMode: .always))
                .indexViewStyle(.page(backgroundDisplayMode: .always))
            }
        }
    }
}

#Preview {
    OnboardingView()
}
