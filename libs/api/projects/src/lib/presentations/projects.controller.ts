import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from '../application/projects.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProjectDto } from './dto/project.dto';
import { CurrentUser } from '@api/auth';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiCreatedResponse({ type: ProjectDto })
  @Post('create')
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser('id') userId: string
  ) {
    return this.projectsService.create(
      createProjectDto.name,
      createProjectDto.description,
      userId,
      createProjectDto.users
    );
  }

  @ApiOkResponse({ type: ProjectDto, isArray: true })
  @Get('me')
  findMeProjects(@CurrentUser('id') userId: string) {
    return this.projectsService.findByOwner(userId);
  }
}
