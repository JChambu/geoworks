class ReportsController < ApplicationController

  skip_before_action :authenticate_user!, :only => [:get_reports, :get_data_report]
  skip_authorize_resource :only => :get_reports

  def get_reports
    respond_to do |format|
      format.html
    end
  end

  def get_data_report
    @id_report = params[:id_report]
    @data = Report.where(id: @id_report)
    render json: @data
  end

  def save_data_report
    @data_report = params[:data]
    @report = Report.new(user_id: current_user, report_data: @data_report)
    @report.save

    render json: {report_id: @report.id}
  end

  def save_form_report
    @id_report = params[:id_report]
    @form_report = params[:form_report]
    @fecha = params[:fecha]
    @quiz = Report.where(id: @id_report).pluck(:quiz).first
    if @quiz.nil?
      @quiz = {}
    end
    
    @quiz[@fecha] = @form_report
    @report = Report.where(id: @id_report).update_all(quiz: @quiz)
  end

  private
  # def user_params
  #   params.require(:user).permit(:name, :email, :country_code, :area_code, :phone, :password, :password_confirmation, :active,
  #     has_project_types_attributes: [:id, :project_type_id, :user_id, :owner, :properties, :_destroy],
  #     user_customers_attributes: [:id, :user_id, :customer_id, :role_id, :_destroy]
  #   )
  # end
end
