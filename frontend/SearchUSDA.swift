//
//  SearchUSDA.swift
//  Qodi
//
//  Created by Miyaz Ansari on 9/3/23.
//

import Foundation

class USDAService {
    static let shared = USDAService()
    
    private let apiKey = "T9dSwKbBYpcpPhPhy0jSn5aGMyQwkSiCcqqI3Jkh"
    
    func fetchIngredients(usdaCode: String, completion: @escaping ([Ingredient]?) -> Void) {
        let endpoint = "https://api.nal.usda.gov/fdc/v1/food/\(usdaCode)?api_key=\(apiKey)"
        
        guard let url = URL(string: endpoint) else {
            completion(nil)
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, _, error in
            guard let data = data, error == nil else {
                completion(nil)
                return
            }
            
            do {
                let response = try JSONDecoder().decode(USDAFoodResponse.self, from: data)
                let ingredients = response.foodNutrients.map { Ingredient(name: $0.name, amount: $0.amount) }
                completion(ingredients)
            } catch {
                completion(nil)
            }
        }.resume()
    }
}

