from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import os

app = Flask(__name__)

BASE_JOB_POSTS = 'linkedin_job_posts.csv'

def ListJobPost():
    list_link = set()
    if os.path.exists(BASE_JOB_POSTS):
        with open(BASE_JOB_POSTS, 'r') as file:
            for row in csv.DictReader(file):
                link = row['URL']
                list_link.add(link)
    
    return list_link

"""Пишем инфу в док """
def RecordingJobPost(title:str, url_job_post:str, company:str, about_job:str):
    if not os.path.exists(BASE_JOB_POSTS):
        with open(BASE_JOB_POSTS, 'a') as file:
            write = csv.writer(file)
            write.writerow(['Company', 'Title', 'URL', 'About'])

    with open(BASE_JOB_POSTS, 'a+') as file:
        write = csv.writer(file)
        write.writerow([company, title, url_job_post, about_job])


@app.route('/')
def index():
    return "<h1>flask app</h1>" 

@app.route('/api/lead', methods=['POST'])
def api_lead():
    lead_info = request.get_json()
    
    title = lead_info['title']
    url_job_post = lead_info['url_job_post']
    company = lead_info['company']
    about_job = lead_info['about_job']

    collection_job_post_url = ListJobPost()
    
    if url_job_post not in collection_job_post_url: 
        
        RecordingJobPost(
            title=title, 
            url_job_post=url_job_post,
            company=company,
            about_job=about_job
        )
        print(
                f'Job Title:\t{title}\n'
                f'Company:\t{company}\n'
                f'URL:\t\t{url_job_post}\n'
                f'About:\t\t{about_job}'
                )
    if url_job_post in collection_job_post_url:
        print(f'принят обработанный URL: {url_job_post}')

    return jsonify({"status":"ok"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='7721')
