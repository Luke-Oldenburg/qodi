//
//  OnboardingView.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/6/23.
//  Change the gray on the final onboarding page button to a nicer color
//Figure out how to see this view again

import SwiftUI

struct OnboardingView: View {
    
    // Declare userOnboarded bool using app storage wrapper so they user is not repeadetly onboarded with each app launch
    
    @AppStorage("userOnboarded") var userOnboarded: Bool = false
    
    var body: some View {
        
        // If user is already onboarded go to home view
        if userOnboarded{
            HomeView(barcodeData: BarcodeData())
        } else {
            // Onboard the user
            ZStack{
                Color.qodiGreen
                    .ignoresSafeArea()
                
                // Scroll through onboarding pages
                TabView{
                    
                    // Pass onboarding view pages with paramaters
                    OnboardView(systemImageName: "questionmark",
                                title: "Complex Additives",
                                description: "Have you ever wondered what the those ingredients are on the back of food boxes? (ex. Maltodextrin)")
                    
                    OnboardView(systemImageName:"barcode.viewfinder",
                                title: "Scan",
                                description: "Learn about these additives and their possible health implications just by scanning the barcode.")
                    
                    finalOnboardView(systemImageName: "chart.bar.doc.horizontal",
                                     title: "Ingredients Summary",
                                     description: "After you scan your food item, you will get a comprehensive breakdown on the food additives.",
                                     userOnboarded: $userOnboarded)
                }
                .tabViewStyle(.page(indexDisplayMode: .always))
                .indexViewStyle(.page(backgroundDisplayMode: .always))
            }
        }
    }
}

// Provide preview for development purposes
#Preview {
    OnboardingView()
}
