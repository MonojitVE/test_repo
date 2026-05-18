import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(override=True)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

COMPANY_OVERVIEW = (
    "VirtualEmployee.com is a leading remote staffing company headquartered near New Delhi, India, "
    "with five branch offices across India and one in the UK. Since 2007, VirtualEmployee.com has "
    "helped Small and Medium Businesses in 48 countries across 5 continents hire dedicated virtual "
    "employees from India in domains ranging from IT and software development to design, marketing, and finance."
)
