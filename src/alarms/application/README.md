## Purpose

the application layer will contains the application services, facades, handlers, and other application specific components which all represent the application layer.

AlarmsService: Orchestrate business logic, không chứa business rules
AlarmRepository (Port): Interface định nghĩa contract cho persistence
CreateAlarmCommand: Command pattern cho input
