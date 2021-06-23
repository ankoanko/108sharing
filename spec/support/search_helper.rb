module SearchHelper
  def search(query = "")
    within("#search") do
      fill_in("search-field", with: query)
      click_button("Search")
    end
  end
end
