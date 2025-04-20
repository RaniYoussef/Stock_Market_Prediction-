class Api::V1::CompaniesController < ApplicationController
    before_action :authenticate_user!, only: [:create]  
    before_action :set_company, only: [:show] 
    
  
    def index
      companies = Company.all
      render json: companies
    end
  
    def show
      render json: @company
    end

    
    def create
      company = Company.new(company_params)
      
      if company.save
        # Trigger export after successfully creating a company
        DataExporter.export_all
  
        render json: { message: 'Company created successfully', company: company }, status: :created
      else
        render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    private
  
    def set_company
      @company = Company.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Company not found' }, status: :not_found
    end

    def company_params
        params.require(:company).permit(:name, :stock_price)
    end
  end
  