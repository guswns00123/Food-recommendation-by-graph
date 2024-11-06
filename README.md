 <h3 align="center">Food Recommendation by graph</h3>

  <!-- ABOUT THE PROJECT -->
## About The Project
이번 프로젝트의 목표는 음식 데이터를 활용하여 graph를 만들고 graph를 통하여 유저들에게 음식을 추천해주는 시스템을 구축하는 것이다.

그래서 우리는 데이터를 조사하여 직접 어떠한 데이터로 만들지 구상해야 했고 해당 데이터로 어떤 그래프를 만들지 결정하였다.

또한 만들어진 그래프를 이용하여 유저들에게 웹 어플리케이션을 통하여 제공할 수 있게 다양한 기능 또한 구현하였다.


프로젝트의 가장 큰 목표

1. 음식 데이터 파이프 라인 구현 방법
   ```bash
   # Windows 리눅스 설치
   wsl --install Ubuntu-22.04
   
   #poetry 설치
   curl -sSL https://install.python-poetry.org | python3 -
    
   # ~/.bashrc 파일 열기
   vi ~/.bashrc 

   # ~/.bashrc 맨 하단에 아래 줄 추가
   PATH="$HOME/.local/bin:$PATH"

   # .bashrc 적용
   source ~/.bashrc

   # 설치 확인
   poetry --version
   
   #pyproject.toml 파일 생성
   poetry init
    
   # 필요한 라이브러리 추가
   poetry add selenium
   poetry add mysql-connector-python
   poetry add chromedriver-autoinstaller
   poetry add requests
   poetry add pandas
   poetry add scrapy

   # Docker 실행
   sudo docker compose up   
   ```

docker 실행 시 crawl 컨테이너를 통해 구현된 scrapy 함수 실행

   
   
2. 정제된 데이터를 이용한 Food Information Graph 구현

3. 만들어진 Graph를 Web application에 적용하여 유저들이 이용가능한 다양한 기능 구현

### Built With
<img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 

## Main Features
![image](/Overall_structure.png)

## Overall UI
![image](/Overall_UI.png)

## Recipe nodes matching onion and water 
![image](/Matching_graph.png)

## UI of thai chicken crock pot recipe information 
![image](/Recipe_information_UI.png)


