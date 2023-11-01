//
//  ResultView.swift
//  Qodi
//
//  Created by Rahul Boggavarapu on 10/23/23.
//

import SwiftUI

// Create Ingredients struct to use JSONDecoder to decode response from backend.
// Conform to the protocols hashable and codable so struct can be used in view and decoded.
struct Ingredients: Hashable, Codable {
    // Response format that is being decoded
    let ingredient: String
    let description: String
}

// ViewModel used to get data for the view
class ViewModel: ObservableObject {
    
    // Published var ingredients allows the ingredients and their descriptons to be used throughout the program
    @Published var ingredients = [Ingredients]()
    
    // Function fetches ingredients from backend
    func fetchIngredients(upc: String) {
        
        // URL used for network call
        guard let url = URL(string: "http://localhost:3000/\(upc)") else {
            return
        }
        
        // task obtains data
        let task = URLSession.shared.dataTask(with: url) { [weak self] data, _, error in
            guard let data = data, error == nil else {
                return
            }
           // Commented code is to see what data is being sent back from the backend. Developers will use this for debugging backend to front end communication
//            let rawResponse = String(data: data, encoding: .utf8)
//            print("Received response:", rawResponse ?? "Unable to convert data to string")
            
            // Decode the data recieved
            do {
                let ingredients = try JSONDecoder().decode([Ingredients].self, from: data)
                            DispatchQueue.main.async {
                                self?.ingredients = ingredients
                            }
            }
            catch {
                print(error)
            }
        }
        // Resume task to keep program running
        task.resume()
        
    }
    
}

struct ResultView: View {
    
    // Uses viewModel state object to use ViewModel class throughout program
    @StateObject var viewModel = ViewModel()
    
    // Observes changes to barcode data from BarcodeData view model
    @ObservedObject var barcodeData: BarcodeData
    
    // Start of view using data models
    var body: some View {
        ZStack {
            VStack (spacing: 20){
                Text("Ingredients Breakdown")
                    .font(.system(size: 30))
                    .fontWeight(.bold)
                
                Spacer()
            }
            .padding()
                
                
                
                // Scroll view to display ingredients and descriptions
                VStack{
                    Spacer(minLength: 70)
                    
                    ScrollView {
                        LazyVStack(spacing: 15) { // Increase the spacing between the items
                            ForEach(viewModel.ingredients, id: \.self) { ingredient in
                                ZStack{
                                    RoundedRectangle(cornerRadius: 10)
                                        .fill(Color(.qodiLightGreen)) // A slightly darker shade of mint
                                        .padding(.horizontal, 10) // Padding on the horizontal sides to prevent cutting off
                                    
                                    HStack{
                                        Image(systemName: "magnifyingglass")
                                            .foregroundColor(.white)
                                        
                                        VStack(alignment: .leading) {
                                            Text(ingredient.ingredient)
                                                .font(.system(size: 15))
                                                .fontWeight(.semibold)
                                            
                                            Text(ingredient.description)
                                                .font(.system(size: 13))
                                        }
                                    }
                                    .padding(15) // Padding inside the RoundedRectangle
                                }
                                
                            }
                        }
                        .padding(.horizontal, 10)
                    }
                }
                
                
                // Scan Again Button positioned in the bottom right
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        Button(action: {
                            barcodeData.reset()
                        }) {
                            ZStack{
                                Circle()
                                    .fill(Color.qodiGreen)
                                    .frame(width: 80, height: 80)
                                Image(systemName: "barcode.viewfinder")
                                    .font(.system(size: 35))
                                    .foregroundColor(.white)
                            }
                        }
                        .padding(.trailing, 50)  // Additional padding to move away from the edge
                        .padding(.bottom, 20)
                    }
                }
                
            }
        // On the appearance of this view, fetch ingredients using the scanned UPC
            .onAppear {
                viewModel.fetchIngredients(upc: barcodeData.lastScannedCode ?? "811620021951")
            }
        // Hide back button
            .navigationBarBackButtonHidden(true)
        }
    }

// Preview for development purposes
    struct ResultView_Previews: PreviewProvider {
        static var previews: some View {
            // Mock data for preview
            let mockData = BarcodeData()
            mockData.lastScannedCode = "123456789012" // Sample UPC code for preview
            
            return ResultView(barcodeData: mockData)
        }
    }
    
    

