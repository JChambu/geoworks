module ChartsHelper

  def chart_types_for_select
    Chart.all.map {|type| [type.name, type.id]}

  end

end
