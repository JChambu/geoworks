module ReportsHelper
  def calculate_percent total, value
    return 0 if total.zero?
    return number_to_percentage((value.to_f * 100.0 / total.to_f), :precision => 2, :separator => '.')
  end

  
  def  sortable(column, title=nil)
    
    link_to "gff", {sort: column}
  end











end
