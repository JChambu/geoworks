class ProjectDataChild < ApplicationRecord

belongs_to :project

  def update_subform properties, user_id
    attributes = {
      properties: properties,
      user_id: user_id,
      gwm_updated_at: Time.now - 3.hours # TODO: Corregir zona horaria
    }
    self.update_attributes(attributes)
  end

end
