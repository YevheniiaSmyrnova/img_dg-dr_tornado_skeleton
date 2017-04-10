import StringIO
import json
import os
import os.path
import tornado.web

from PIL import Image


def object_recognize(img):

    lst_jsn = {'confidence': 0.99999998, 'label': 'nothing'}
    res = {'results': [lst_jsn]}
    res = str(res)
    res = res.replace("\'", '\"')
    return res


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')


settings = dict(
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    debug=True
)


class Upload(tornado.web.RequestHandler):
    def post(self):
        fileinfo = self.request.files['0'][0]['body']

        image = Image.open(StringIO.StringIO(fileinfo))

        self.write(json.dumps(object_recognize(image)))
        self.finish()
        self.flush()


application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/upload", Upload),
], **settings)

if __name__ == "__main__":
    print('Server Runing')
    print('Press ctrl + c to close')
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
