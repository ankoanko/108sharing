class ApplicationSerializer
  include JSONAPI::Serializer

  def self.serializer_array(collection, options = {})
    options[:is_collection] = true
    options[:include] = opt_include
    new(collection, options).serializable_hash
  end

  def self.serialize(object, options = {})
    options[:is_collection] = false
    options[:include] = opt_include
    new(object, options).
      serializable_hash
  end

  def self.opt_include
    []
  end
end
