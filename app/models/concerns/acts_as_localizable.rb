module ActsAsLocalizable
  # rubocop:disable Lint/UselessAssignment
  def acts_as_column_i18n(*columns)
    raise ArgumentError, "columns is required" if columns.empty?

    columns.each do |col|
      define_method "#{col}_i18n" do
        val = __send__ "#{col}_#{I18n.locale}"
        val ||= __send__ col
      end
    end
  end
end
