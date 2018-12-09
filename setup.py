from setuptools import setup

setup(
    name='server-monitor',
    packages=['server-monitor'],
    include_package_data=True,
    install_requires=[
        'firebase_admin',
        'psutil',
    ],
)
