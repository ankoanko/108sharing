module Pagination
  # rubocop:disable Metrics/AbcSize
  def paginated_json(collection)
    collection = collection.page(params[:page])
    collection_json = block_given? ? yield(collection) : collection.as_json
    current_page = params[:page] || 1

    hash = {}
    hash[collection.name.downcase.pluralize.to_sym] = collection_json
    hash[:meta] = {
      current_page: current_page,
      total_pages: collection.page(1).total_pages,
      next_page: collection.page(params[:page]).next_page,
      prev_page: collection.page(params[:page]).prev_page,
      total_count: collection.total_count,
    }
    hash
    # {
    #   collection: collection.as_json,
    #   meta: {
    #     current_page: current_page,
    #     total_pages: collection.page(1).total_pages,
    #     next_page: collection.page(params[:page]).next_page,
    #     prev_page: collection.page(params[:page]).prev_page
    #   }
    # }
  end
  # rubocop:enable Metrics/AbcSize

  def json_pagination(collection, serializer, options = {}, per = nil)
    page = (options[:page] || params[:page] || 1).to_i
    collection = collection.page(page).per(per)
    # collection_json = block_given? ? yield(collection) : collection.as_json
    options[:meta] = {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      next_page: collection.next_page,
      prev_page: collection.prev_page,
      total_count: collection.total_count,
    }
    collection_json = serializer.serializer_array(collection, options)
    { collection.name.downcase.pluralize.to_sym => collection_json }
    # {
    #   collection: collection.as_json,
    #   meta: {
    #     current_page: current_page,
    #     total_pages: collection.page(1).total_pages,
    #     next_page: collection.page(params[:page]).next_page,
    #     prev_page: collection.page(params[:page]).prev_page
    #   }
    # }
  end

  #   def json_pagination(collection, serializer, status = :ok)
  #     collection = collection.page(params[:page])
  #     data = {
  #       pagination: {
  #         total: collection.total_count,
  #         pages: collection.total_pages,
  #         current_page: collection.current_page,
  #         per_page: collection.limit_value
  #       },
  #       entries: serializer.serializer_array(collection)
  #     }
  #     json_default(result: 'success', data: data, status: status)
  #   end
end
