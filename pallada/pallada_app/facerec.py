import os
import dlib
from skimage import io
from scipy.spatial import distance
from pathlib import Path
import pickle

BASE_DIR = Path(__file__).resolve().parent.parent


# алгоритмы
class FaceRec:
    def __init__(self, ):
        self.sp = dlib.shape_predictor(
            os.path.join(BASE_DIR, 'DLIB', 'shape_predictor_68_face_landmarks.dat')
        )
        self.facerec = dlib.face_recognition_model_v1(
            os.path.join(BASE_DIR, 'DLIB', 'dlib_face_recognition_resnet_model_v1.dat')
        )
        self.detector = dlib.get_frontal_face_detector()

        self.path_to_media = os.path.join(BASE_DIR, 'media')
        self.path_to_media_simples = os.path.join(self.path_to_media, 'simples')
        self.descriptors = self.descript_all(self.path_to_media_simples)

    def descript(self, photo, path):
        """
        дескриптер преобразует фото в матрицу
        название фото, путь к папке с фото, алгоритмы из коробки
        """
        try:
            img = io.imread(os.path.join(path, photo))
            dets_webcam = self.detector(img, 1)
            shape_name = None
            for k, d in enumerate(dets_webcam):
                shape_name = self.sp(img, d)
            res_descriptor = self.facerec.compute_face_descriptor(img, shape_name)
        except Exception:
            res_descriptor = None
        return res_descriptor

    def descript_all(self, path_to_photos):
        """
        дескриптер по папке с фото
        """
        try:
            face_descriptors = []
            faces = os.listdir(path_to_photos)  # адрес папки с лицами
            for i in faces:
                face_descriptors.append(self.descript(i, path_to_photos))
            res = face_descriptors
            # with open('face_db.pickle', 'wb') as fout:
            #     pickle.dump(res, fout)
        except Exception:
            res = None
        return res

    def recognize(self, photo):
        """
        идентификатор находит матрицу из базы с самым близким расстоянием
        название фото, путь к фото для распозн., алгоритмы из коробки, бд деструкторов,
        """
        distances = []
        main_descriptor = self.descript(photo, self.path_to_media)
        for i in self.descriptors:
            distances.append(distance.euclidean(main_descriptor, i))
        min_dist = min(distances)
        faces = os.listdir(self.path_to_media_simples)

        id_ = None
        if min_dist > 0.6 and len(self.descriptors) == 1:
            id_ = None
        elif min_dist <= 0.6 and len(self.descriptors) > 1:
            id_ = faces[distances.index(min_dist)][:-4]  # точно
        elif min_dist > 0.6 and len(self.descriptors) > 1:
            id_ = faces[distances.index(min_dist)][:-4]  # неточно
        return id_


# path_to_media = os.path.join(BASE_DIR, 'media')
# path_to_media_simples = os.path.join(path_to_media, 'simples')
# rec = FaceRec()
# _all = rec.descript_all(path_to_media_simples)
# print(rec.recognize('photo_2020-11-07_08-19-16.jpg'))
