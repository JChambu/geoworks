module ChartsHelper

  def chart_types_for_select
    Chart.all.ordered.map {|type| [type.name, type.id]}

  end

end
