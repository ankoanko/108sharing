module ScopedSetting
  extend ActiveSupport::Concern

  included do
    has_many :settings, as: :thing #rubocop:disable Rails/HasManyOrHasOneDependent
    AVAILABLE_SETTINGS = []
  end

  class_methods do
    def scoped_field(name, default: nil)
      AVAILABLE_SETTINGS.push(name)

      define_method(name) do
        obj = settings.find_by(var: name) || settings.new(var: name, value: default)
        obj.value
      end

      define_method("#{name}=") do |val|
        record = settings.find_by(var: name) || settings.new(var: name)
        record.value = val
        record.save!

        val
      end
    end
  end
end
