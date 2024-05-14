class AddPrefilterLabelsSubformsToProjectSubfields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_subfields, :prefilter_labels_subforms, :boolean, default: false
  end
end
