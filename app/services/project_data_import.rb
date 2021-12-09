class ProjectDataImport
  attr_accessor :project_type

  def initialize(project_type, file)
    @project_type = project_type
    @file = file
  end

  def validate
  end

  def process
    validate
    
  end
end
