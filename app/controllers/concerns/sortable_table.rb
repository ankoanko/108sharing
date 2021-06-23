module SortableTable
  extend ActiveSupport::Concern

  included do
    helper_method :sort_column, :sort_direction, :default_sort_column
  end

  # sort_columnメソッドが重複している。
  # 後者を消すと、こちらのメソッドで使われているsortable_columnsが"undefined local variable or method"でエラーになる
  def sort_column
    sortable_columns.include?(params[:sort]) ? params[:sort] : default_sort_column
  end

  def default_sort_column
    "id"
  end

  def sort_direction
    %w[asc desc].include?(params[:direction]) ? params[:direction] : "desc"
  end

  def sort_column
    params[:sort] || "id"
  end
end
